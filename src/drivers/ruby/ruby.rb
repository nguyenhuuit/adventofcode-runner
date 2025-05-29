#!/usr/bin/env ruby

require 'json'
require 'benchmark'

$stdout.sync = true

year = ARGV[0]
day = ARGV[1]
part = ARGV[2]
inp = ARGV[3]

folder = "#{year}/day#{day}"
input_file = "../#{folder}/#{inp}.txt"

require_relative "../../../#{folder}/part#{part}.rb"

input_text = File.read(File.expand_path(input_file)).strip


begin
  result = nil
  execution_time = Benchmark.measure do
    result = solution(input_text)
  end
  
  # Prepare output data
  rs_str = '-'
  if result != nil
    rs_str = result.to_s
  end
  output = {
    "result" => rs_str,
    "time" => "#{format('%.3f', execution_time.real * 1000)}ms"
  }
  
  IO.new(3, "w").puts output.to_json + "\n"
rescue Exception => e
  puts "An error occurred: #{e.message}"
  puts e.backtrace
  error_output = {
    "result" => "-",
    "time" => "-"
  }
  IO.new(3, "w").puts error_output.to_json + "\n"
end

