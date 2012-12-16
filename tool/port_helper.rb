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
str.gsub!(/class (.*)$/, 'export class \1 {')
str.gsub!(/module (.*)/, 'module \1 {')

# Add bracket for if statement
str.gsub!(/if (.*)$/, 'if (\1) {')

# convert unless keyward into if!
str.gsub!(/unless (.*)$/, 'if !(\1) {')

# convert else
str.gsub!('else', '} else {')

# convert end
str.gsub!(/(\W)end/, '\1}')

# nil -> null
str.gsub!(/\Wnil(\b)/, ' null')

# Global variable is Datamanager
#str.gsub!(/\$(.*)\b/, 'DataManager.\1')

# Swap position of if statement
str.gsub!(/^(\s*)(.*\w+.*)(if.*\{)$/, '\1\3'+ "\n" + '\1    \2' + "\n" +'\1}')

# Convert new statement
str.gsub!(/(\w*)\.new\s*(.*)$/, 'new \1(\2')

# Convert do statement
str.gsub!(/\)\s*do\s*\|(.*)\|/, ', (\1) => {')

# Add ; in the end of the line
str.gsub!(/([\w\]\)])\s*$/, '\1;')

# Convert forgotten do
str.gsub!(/\(\s*do\s*;/, '(() => {')

("a".."z").each do |v|
	str.gsub!(/_#{v}/, v.upcase)
end

# Generate members, reader, accessor
members = str.map{ |s| s.scan(/\@(\w*)\b/) }.flatten.uniq
accessors = str.scan(/attrAccessor(.*)$/).flatten
readers = str.scan(/attrReader(.*)$/).flatten
accessors = accessors.map {|s| s.scan(/(?:\:(\w*)[\,\;])/)}.flatten.uniq
readers = readers.map {|s| s.scan(/(?:\:(\w*)[\,\;])/)}.flatten.uniq

str.gsub!(/attrReader.*\:(\w*)\b;/, '');
str.gsub!(/attrAccessor.*\:(\w*)\b;/, '');

# Categorize private and public
publics = []
privates = []
members.each do |member| 
	if accessors.include?(member)
		publics << member
	else
		privates << member
	end
end

member_str = "
//
// private members
//
"
privates.each do |member|
	member_str += "private" + " #{member}_:any;\n"
end

member_str += "
//
// public members
//
"
publics.each do |member|
	member_str += "public" + " #{member}:any;\n"
end

member_str += "
//
// accessors
//
"
readers.each do |member|
	member_str += "public get #{member}(): any {return this.#{member}_;}\n"
end

str = member_str + str

str.gsub!(/self(\W)/, 'this\1')
str.gsub!(/\@(\w*)\b/, 'this.\1_')
str.gsub!(/public initialize\((.*)\): any \{/, 'constructor(\1) {')
str.gsub!(")()", ')')

("a".."z").each do |v|
	str.gsub!(/\.#{v}(\w*)\?/, ".is" + v.upcase + '\1')
end

puts str