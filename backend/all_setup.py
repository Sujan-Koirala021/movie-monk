from setup.db_setup import setup_table
from setup.kb_setup import setup_kb, populate_kb
from setup.agent_setup import setup_agent

if __name__ == "__main__":
    setup_table()
    setup_kb()
    populate_kb()
    setup_agent()
