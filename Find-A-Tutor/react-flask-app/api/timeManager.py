from datetime import datetime, timedelta                    #used to compare dates


#split a large block of time into 15 minute increments
def splitTimes(timeToSplit):
    startSplit = datetime.strptime(timeToSplit['start'], '%Y-%m-%dT%H:%M:%S')   #the start of the block to split
    endSplit = datetime.strptime(timeToSplit['end'], '%Y-%m-%dT%H:%M:%S')       #the end of the block to split
    curEnd = startSplit + timedelta(minutes=15)                                 #the end of the first 15 minute intervals
    splitTimeArray = []                                                         #the array of 15 minute time blocks

    #go through the time block until the end in found
    while curEnd < endSplit:
        #add shortened block into the array
        splitTimeArray.append({
            'start':datetime.strftime(startSplit, '%Y-%m-%dT%H:%M:%S'), 
            'end':datetime.strftime(curEnd, '%Y-%m-%dT%H:%M:%S')
        })
        #get the end and start for the next 15 minute block
        startSplit = curEnd
        curEnd = startSplit + timedelta(minutes=15)
    
    #put last time in array
    splitTimeArray.append({
        'start':datetime.strftime(startSplit, '%Y-%m-%dT%H:%M:%S'), 
        'end':datetime.strftime(endSplit, '%Y-%m-%dT%H:%M:%S')
    })
    
    #return array of 15 minute increments
    return splitTimeArray


#takes all the 15min times and makes them one block
#input must be an array of datetimes formatted like this
##### YYYY-MM-DDThh:mm:ss #####
def mergeTimes(timeArray):
    print("merge")
    #make sure to exclude the first and include the last block
    first = True
    left = len(timeArray)
    #set the expected difference between timeblocks
    minDif = timedelta(minutes=15)
    
    print("setup")
    
    #management vars
    curTime = datetime.now()        #the last time (for comparing)
    timeBlockArray = []             #the new array of merged timeblocks
    curBlockStart = datetime.now()  #the current start time for a merged block
    curBlockEnd = datetime.now()    #the current end time for a merged block
    lastTutorInfo = timeArray[0]    #the information for the first tutor block (needed to make sure the last block for a user doesn't take the next user's info)

    print("go")

    #go through every in the timeArray
    for time in timeArray:
        print(type(time['start']))

        #get the start and end times for the entry
        startTime = datetime.strptime(time['start'], '%Y-%m-%dT%H:%M:%S')
        endTime = datetime.strptime(time['end'], '%Y-%m-%dT%H:%M:%S')
        
        #check if this is for an appointment or not
        if 'tut_email' in time:
            #if the difference between the last entry and this one is not 15 minutes, start the new merged block
            if ((endTime - curTime) != minDif) or lastTutorInfo['tut_email'] != time['tut_email']:
                #if this is the first don't add last entry's info
                if not first:
                    timeBlockArray.append({
                        'tut_email':lastTutorInfo['tut_email'], 
                        'tut_name':lastTutorInfo['tut_name'],
                        'classes':lastTutorInfo['classes'],
                        'start':datetime.strftime(curBlockStart, '%Y-%m-%dT%H:%M:%S'),
                        'end':datetime.strftime(curBlockEnd, '%Y-%m-%dT%H:%M:%S'),
                        'type': "time",
                        'title': "Available Time with " + lastTutorInfo['tut_name'],
                        'rating': lastTutorInfo['rating']
                    })
                else:
                    #no longer the first ever entry
                    first = False
                
                #set new blocks start and end
                curBlockStart = datetime.strptime(time['start'], '%Y-%m-%dT%H:%M:%S')
                curBlockEnd = datetime.strptime(time['end'], '%Y-%m-%dT%H:%M:%S')
            else:
                #make the new block end equal to the last entry's end time
                curBlockEnd = datetime.strptime(time['end'], '%Y-%m-%dT%H:%M:%S')
                
            #if this is the last block, finalize the block
            if left == 1:
                timeBlockArray.append({
                    'tut_email':lastTutorInfo['tut_email'], 
                    'tut_name':lastTutorInfo['tut_name'],
                    'classes':lastTutorInfo['classes'],
                    'start':datetime.strftime(curBlockStart, '%Y-%m-%dT%H:%M:%S'),
                    'end':datetime.strftime(curBlockEnd, '%Y-%m-%dT%H:%M:%S'),
                    'type': "time",
                    'title': "Available Time with " + lastTutorInfo['tut_name'],
                    'rating': time['rating']
                })
        else:
            #if the difference between the last entry and this one is not 15 minutes, create a new merged block
            if (endTime - curTime) != minDif:
            #if this is the first don't add last entry
                if not first:
                    #add the information to the array
                    timeBlockArray.append({
                        'startTime': datetime.strftime(curBlockStart, '%Y-%m-%dT%H:%M:%S'),
                        'endTime': datetime.strftime(curBlockEnd, '%Y-%m-%dT%H:%M:%S')
                    })
                else:
                    #no longer the first entry
                    first = False
                
                #start the new block's info
                curBlockStart = datetime.strptime(time['start'], '%Y-%m-%dT%H:%M:%S')
                curBlockEnd = datetime.strptime(time['end'], '%Y-%m-%dT%H:%M:%S')
            else:
                #make the new block end equal to the last entry's end time
                curBlockEnd = datetime.strptime(time['end'], '%Y-%m-%dT%H:%M:%S')
            
            #if this is the last block, finalize the block
            if left == 1:
                timeBlockArray.append({
                    'startTime': datetime.strftime(curBlockStart, '%Y-%m-%dT%H:%M:%S'),
                    'endTime': datetime.strftime(curBlockEnd, '%Y-%m-%dT%H:%M:%S')
                })
        
        #hold the new last time's end (curTime)
        curTime = datetime.strptime(time['end'], '%Y-%m-%dT%H:%M:%S')
        left-=1                 #decrement the counter
        lastTutorInfo = time    #hold the info from the last tutor
    
    #return the new array of merged times
    return timeBlockArray
    
#take a datetime (YYYY-MM-DDThh:mm:ss) and a time (HH:MM)
#combine them into a new datetime (YYYY-MM-DDThh:mm:ss)
#needed for storage recieved from timepickers
def createDateFromTime(day, time):
    #check for proper format
    if len(day) == 19 and 'T' in day:
        #leave day as is
        date = day
    else:
        #parse day to proper format
        date = dateParse(day)
        
    #split on "T" and store the first part (YYYY-MM-DD) in new datetime
    newDay = date.split("T")[0]
    #add the separator, time, and seconds
    newDate = newDay + "T" + time + ":00"

    #return new datetime
    return newDate
    
#take a Moment format from React and format it to YYYY-MM-DDThh:mm:ss
#needed for storage and calendar display
def dateParse(date):
    #get the parts of the date
    #separated by whitespace
    dateArray = date.split()
    
    #put the year into the new datetime
    newDate = dateArray[3] + "-"
    
    #put the month into the new datetime
    if(dateArray[1] == "Jan"):
        newDate += "01-"
    elif(dateArray[1] == "Feb"):
        newDate += "02-"
    elif(dateArray[1] == "Mar"):
        newDate += "03-"
    elif(dateArray[1] == "Apr"):
        newDate += "04-"
    elif(dateArray[1] == "May"):
        newDate += "05-"
    elif(dateArray[1] == "Jun"):
        newDate += "06-"
    elif(dateArray[1] == "Jul"):
        newDate += "07-"
    elif(dateArray[1] == "Aug"):
        newDate += "08-"
    elif(dateArray[1] == "Sep"):
        newDate += "09-"
    elif(dateArray[1] == "Oct"):
        newDate += "10-"
    elif(dateArray[1] == "Nov"):
        newDate += "11-"
    elif(dateArray[1] == "Dec"):
        newDate += "12-"
    
    #put the day into the new datetime
    newDate += dateArray[2] + "T"
    
    #if seconds is not 00 reset to 00
    checkSec = dateArray[4].split(':')
    if checkSec[2] != "00":
        newDate += checkSec[0] + ":" + checkSec[1] + ":00" 
    else:
        #put the time into the new datetime
        newDate += dateArray[4]
    
    #return the new datetime    
    return newDate

#take a time and make it happen weekly until it is greater than the end period
def makeRecurring(date, endPeriod):
    #make the date into a datetime
    curDate = datetime.strptime(str(date), '%Y-%m-%dT%H:%M:%S')
    dateArray = []
    
    #check the endPeriod if there is none, create for 3 months
    if endPeriod:
        endDate = datetime.strptime(endPeriod, '%Y-%m-%dT%H:%M:%S')
        #continue making iterations of the date until it is greater than the endPeriod
        while curDate < endDate:
            dateArray.append(curDate)
            curDate = curDate + timedelta(weeks=1)
    else:
        #default endPeriod to 12 weeks (about 3 months)
        endPeriod = curDate + timedelta(weeks=12)
        endDate = datetime.strptime(endPeriod, '%Y-%m-%dT%H:%M:%S')
        #continue making iterations of the date until it is greater than the endPeriod
        while curDate < endDate:
            dateArray.append(curDate)
            curDate = curDate + timedelta(weeks=1)

    return dateArray 