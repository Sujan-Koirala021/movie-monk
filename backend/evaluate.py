"""
MindsDB Knowledge Base Evaluator for Movie Dataset
Evaluates a knowledge base using test data and saves results with timestamps.
"""

import pandas as pd
import mindsdb_sdk
import os
import argparse
from datetime import datetime
from dotenv import load_dotenv
import sys

def load_environment():
    """Load environment variables from .env file"""
    load_dotenv()
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in .env file")
    return api_key

def connect_to_mindsdb():
    """Establish connection to MindsDB"""
    try:
        server = mindsdb_sdk.connect()
        return server
    except Exception as e:
        print(f"Failed to connect to MindsDB: {e}")
        sys.exit(1)

def create_table_from_csv(server, csv_file_path, table_name="movie_test_data"):
    """Create MindsDB table from CSV file"""
    try:
        if not os.path.exists(csv_file_path):
            raise FileNotFoundError(f"CSV file not found: {csv_file_path}")
        
        df = pd.read_csv(csv_file_path)
        
        # Validate required columns
        required_columns = ['question', 'doc_id']
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise ValueError(f"Missing required columns: {missing_columns}")
        
        # Get default database
        database = server.get_database('files')
        
        # Drop table if exists
        try:
            database.drop_table(table_name)
        except:
            pass  # Table doesn't exist, which is fine
        
        # Create table from dataframe
        database.create_table(table_name, df)
        return table_name
        
    except Exception as e:
        print(f"Failed to create table: {e}")
        sys.exit(1)

def run_evaluation(server, api_key, table_name="movie_test_data"):
    """Run the knowledge base evaluation"""
    try:
        # Build the evaluation query
        evaluation_query = f"""
        EVALUATE KNOWLEDGE_BASE movie_recommender.movies_kb
        USING
            test_table = files.{table_name},
            evaluate = true,
            version = 'doc_id',
            llm = {{
                'provider': 'gemini',
                'api_key': '{api_key}',
                'model_name': 'gemini-2.0-flash'
            }};
        """
        
        # Execute the evaluation
        result = server.query(evaluation_query)
        
        # Convert result to DataFrame
        result_df = result.fetch()
        return result_df
        
    except Exception as e:
        print(f"Evaluation failed: {e}")
        sys.exit(1)

def save_results(result_df, save_path="evaluate_result.csv"):
    """Save evaluation results to CSV with timestamp"""
    try:
        # Add timestamp column
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        result_df['timestamp'] = timestamp
        result_df['evaluation_date'] = datetime.now().strftime("%Y-%m-%d")
        
        # Reorder columns to put timestamp first
        cols = ['timestamp', 'evaluation_date'] + [col for col in result_df.columns if col not in ['timestamp', 'evaluation_date']]
        result_df = result_df[cols]
        
        # Always append if file exists
        if os.path.exists(save_path):
            try:
                existing_df = pd.read_csv(save_path)
                if list(existing_df.columns) == list(result_df.columns):
                    result_df.to_csv(save_path, mode='a', header=False, index=False)
                else:
                    # Headers don't match, create new file with timestamp suffix
                    timestamp_suffix = datetime.now().strftime("%Y%m%d_%H%M%S")
                    new_save_path = save_path.replace('.csv', f'_{timestamp_suffix}.csv')
                    result_df.to_csv(new_save_path, index=False)
            except Exception:
                result_df.to_csv(save_path, index=False)
        else:
            result_df.to_csv(save_path, index=False)
        
        
    except Exception as e:
        print(f"Failed to save results: {e}")
        sys.exit(1)

def main():
    """Main execution function"""
    parser = argparse.ArgumentParser(
        description="Evaluate MindsDB Knowledge Base using movie test data"
    )
    
    parser.add_argument('csv_file', help='Path to the CSV file containing test data')
    parser.add_argument('--save', default='evaluate_result.csv', help='Output CSV file path')
    parser.add_argument('--table-name', default='movie_test_data', help='Name for the MindsDB table')
    
    args = parser.parse_args()
    
    try:
        # Load environment and connect
        api_key = load_environment()
        server = connect_to_mindsdb()
        
        # Create table and run evaluation
        table_name = create_table_from_csv(server, args.csv_file, args.table_name)
        result_df = run_evaluation(server, api_key, table_name)
        
        # Save and print results
        save_results(result_df, args.save)
        
    except KeyboardInterrupt:
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()