require 'rubygems'
require 'json'

class String
def camel_case
  return self if self !~ /_/ && self =~ /[A-Z]+.*/
  arr = split('_')
  if arr.length > 1
	  split('_').map{|e| e.capitalize}.join
	end
end
end


input_file = ARGV[0]

str = ""
File.open(input_file, "r") do |f|
    str = f.read
end

str.gsub!(/def (.*_.*)$/, 'public \1(): any {')
str.gsub!(/if (.*)$/, 'if (\1) {')
str.gsub!('else', '} else {')
str.gsub!('end', '}')

("a".."z").each do |v|
	str.gsub!(/_#{v}/, v.upcase)
end

str = str.gsub(/\@(\w*)\s/, 'this.\1_ ')

puts str