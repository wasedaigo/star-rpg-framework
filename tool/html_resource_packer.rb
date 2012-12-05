require "rubygems"
require 'json'

result = []
input_dir = ARGV[0]
output_dir = ARGV[1]

list = [
	{"ext" => "png", "type" => "image"},
	{"ext" => "tmx", "type" => "tmx"},
	{"ext" => "wav", "type" => "effect"}
       ]

list.each do |desc|
  pathes = Dir["#{input_dir}/**/*.#{desc['ext']}"]
  pathes.each do |path|
    str = path.gsub(input_dir + "/", "res/")
    result << {"type" => desc['type'] ,"src" => str}
  end
end

content = "var g_ressources = "+ result.to_json + ";"
path = "#{output_dir}/resources.js"
File.open(path, 'w') do |f| 
  f.write(content)
  p "Resource Packed at #{path}"
end
