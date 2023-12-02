import sys
import os
import time
import importlib
import json

args = sys.argv
year = args[1]
day = args[2]
part = args[3]
inp = args[4]

folder = year + "/day" + day
input_file = folder + "/" + inp + ".txt"
sys.path.append(os.path.abspath(folder))

mod = importlib.import_module('part' + part)

with open(os.path.abspath(input_file)) as inp:
  input_text = inp.read().strip()
  start_time = time.perf_counter_ns()
  rs = mod.solution(input_text)
  end_time = time.perf_counter_ns()
  execution_time = (end_time - start_time)/1000000
  dt = {
    "result": rs,
    "time": "{:.3f}ms".format(execution_time)
  }
  os.write(3, (json.dumps(dt) + "\n").encode())
