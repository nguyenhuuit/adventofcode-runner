import sys
import os
import time
import importlib
import json
from pathlib import Path

args = sys.argv
solution_file = args[1]
input_file = args[2]

path = Path(solution_file)
folder = path.parent
file_full_name = path.name

file_name = file_full_name.split('.')[0]

sys.path.append(os.path.abspath(folder))

mod = importlib.import_module(file_name)

with open(os.path.abspath(input_file)) as inp:
  input_text = inp.read().strip()
  start_time = time.perf_counter_ns()
  rs = mod.solution(input_text)
  end_time = time.perf_counter_ns()
  execution_time = (end_time - start_time)/1000000
  dt = {
    "result": str(rs),
    "time": "{:.3f}ms".format(execution_time)
  }
  os.write(3, (json.dumps(dt) + "\n").encode())
