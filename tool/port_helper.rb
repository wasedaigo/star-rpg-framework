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

str.gsub!('#', '//')
str.gsub!('  ', '    ')
str.gsub!(/def (.*)$/, 'public \1(): any {')
str.gsub!(/class (.*)$/, 'class \1 {')
str.gsub!(/if (.*)$/, 'if (\1) {')
str.gsub!('else', '} else {')
str.gsub!(/(\W)end\b/, '\1}' + "\n")
str.gsub!(/\Wnil(\b)/, ' null')
str.gsub!(/\$(.*)\b/, 'DataManager.\1')
str.gsub!(/([\w\]\)])$/, '\1;')

("a".."z").each do |v|
	str.gsub!(/_#{v}/, v.upcase)
end
str.gsub!(/\@(\w*)\b/, 'this.\1_')
str.gsub!("public initialize(): any {", "constructor() {")
puts str