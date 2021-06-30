import json
with open('opm-op-easy.json') as f1:
    file1 = json.load(f1)
with open('opm-op-pos.json') as f2:
    file2 = json.load(f2)

counter = 1
newdict = {}
for key in file1:
    if str(counter) in file2:
        newdict[key] = {'position': file2[str(counter)]}
    else:
        newdict[key] = {'position': [0,0]}
    counter+=1
with open('opm-op-seq.json', "w") as f:
    json.dump(newdict, f)