require 'rubygems'
require 'json'

input_dir, output_dir = *ARGV

list = [
	{'ext' => 'png', 'type' => 'image'},
	{'ext' => 'tmx', 'type' => 'tmx'},
	{'ext' => 'wav', 'type' => 'effect'},
       ]

result = list.inject([]) do |result, desc|
  pathes = Dir["#{input_dir}/**/*.#{desc['ext']}"]
  result + pathes.map do |path|
    {
      'type' => desc['type'],
      'src'  => path.gsub(input_dir + "/", "res/"),
    }
  end.to_a
end

puts "var g_ressources = #{result.to_json};"
