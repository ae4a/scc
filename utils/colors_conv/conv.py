
f = open("skin.txt", "r", encoding="utf-8")

lines = f.read().split("\n")

for l in lines:
  if len(l) == 0 or l[0] == '/' or l[0] == ' ':
    continue
  words = l.split(" ")

  print(f'  {{"text": "{words[0]}", "color": "{words[1]}", "value": "{words[1]}"}},')
