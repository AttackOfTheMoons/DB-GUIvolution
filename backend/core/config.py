import os

from dotenv import dotenv_values

env = {**dotenv_values(".env"), **os.environ}
