import sys

f = open(sys.argv[1], "r", encoding="utf-8")

lines = f.read().split("\n")

first = True
str = ""
for l in lines:
  if len(l) == 0 or l[0] != '#':
    continue
  words = l.split(" ", 1)
  if not first:
    str += ","

  first = False
  str += f'{{"text": "{words[1]}", "color": "{words[0]}", "value": "{words[0]}"}}'

print(f'{{"compensation": {sys.argv[2]}, "palette": [{str}]}}')
