import random
gahu=['x','.','.','x','.','.','x','.','.','.','x','.','.','.','x','.'] 
l=['x','x','x','.','.','.','x','.','.','x','.','.','x','.','.','.'] ##original rhythm from the assignment
pulses = len(l)                     ## This and the onsets values should not be changed cause for now
onsets = l.count('x')                      ## the program can't compare two histograms with different # of pulses.
pairwiseQuantity = 78            ## Number of pairwise rhythms to generate. (INCLUDING INSTANCES OF SAME NECKLACES AND BRACELETS)
IOIQuantity = 500                ## Number of pairwise rhythms to generate. (INCLUDING INSTANCES OF SAME NECKLACES AND BRACELETS)
rhythmPairwiseList =[]          ## List to store rhythms so that they don't repeat.
rhythmIOIList =[]               ## List to store rhythms so that they don't repeat.
def PairwiseHisto(rhythm):      ## Generate histogram based on rhythm (creates a dictionary)
    indices=[]
    for i in range(len(rhythm)):
        if rhythm[i] == 'x':
            indices.append(i)
    dic = {}
    for i in range(len(rhythm)-1):
        dic[i+1]=0
    for i in range(len(indices)):
        for j in range(len(indices)):
            diff=indices[-(j+1)]-indices[i]
            if diff >0:
                if diff >8:
                    diff = len(rhythm)-diff
                dic[diff] +=1
    for i in range(int(len(rhythm)/2)+1,len(rhythm)):
        del dic[i]
        
    return dic

def CheckPairwiseRhythm(generatedRhythm, rhythm, histogram):        ## cause cmp() not supported in Python 3
    newHisto = PairwiseHisto(generatedRhythm)                       ##(but it's still useless cause it can be
    if newHisto == histogram and rhythm != generatedRhythm:         ##compared using ==
        return True
    else:
        return False

def CheckIOIRhythm(generatedRhythm, rhythm, histogram):        ## cause cmp() not supported in Python 3
    newHisto = IOIHisto(generatedRhythm)                       ##(but it's still useless cause it can be
    if newHisto == histogram and rhythm != generatedRhythm:         ##compared using ==
        return True
    else:
        return False

def IOIHisto(rhythm):
    IOIList=[]
    indices=[]
    for i in range(len(rhythm)):
        if rhythm[i] == 'x':
            indices.append(i)
    for i in range(len(indices)-1):
        IOIList.append(indices[i+1]-indices[i])
    IOIList.append(len(rhythm)-indices[-1])
    IOIList.sort()
    return IOIList
    
def GenerateIOIRhythm(pulses,onsets,rhythm):
    print("Rhythms with same Inter Onset Intervals(adjacent) histograms are the following:")
    histo = IOIHisto(rhythm)
    good = False
    d=0
    while good == False:
        generatedRhythm=[]
        a=onsets
        for i in range(pulses):
            if a > 0:
                inputt=random.choice(['x','.'])
                if inputt == 'x':
                    a-=1
                generatedRhythm.append(inputt)
            else:
                generatedRhythm.append('.')
                       
        if (CheckIOIRhythm(generatedRhythm, rhythm, histo) == True and generatedRhythm not in rhythmIOIList):
            good = True
            d+=1
            rhythmIOIList.append(generatedRhythm)
            print('['+''.join(generatedRhythm)+']')
            print(d)
            if d<IOIQuantity:
                good=False

def GeneratePairwiseRhythm(pulses,onsets,rhythm): ##Generates rhythms
    print("The Inter Onset Interval of the rhythm:", "["+''.join(rhythm)+']', "is", PairwiseHisto(rhythm))
    print("Rhythms with same pairwise histograms as" ,"["+''.join(rhythm)+']', "are the following:")
    histo = PairwiseHisto(rhythm)
    good = False
    c=0
    while good == False:
        generatedRhythm=[]
        a=onsets
        for i in range(pulses):
            if a > 0:
                inputt=random.choice(['x','.'])
                if inputt == 'x':
                    a-=1
                generatedRhythm.append(inputt)
            else:
                generatedRhythm.append('.')
                       
        if (CheckPairwiseRhythm(generatedRhythm, rhythm, histo) == True and generatedRhythm not in rhythmPairwiseList):
            good = True
            c+=1
            rhythmPairwiseList.append(generatedRhythm)
            print(c)
            print('['+''.join(generatedRhythm)+']')
            print(PairwiseHisto(rhythm))
            if c<pairwiseQuantity:
                good=False

   
GeneratePairwiseRhythm(pulses,onsets,l)


        
    
