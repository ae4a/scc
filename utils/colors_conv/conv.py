
f = open("viscose.txt", "r", encoding="utf-8")

lines = f.read().split("\n")

for l in lines:
  if len(l) == 0 or l[0] != '#':
    continue
  words = l.split(" ", 1)

  print(f'  {{"text": "{words[1]}", "color": "{words[0]}", "value": "{words[0]}"}},')
