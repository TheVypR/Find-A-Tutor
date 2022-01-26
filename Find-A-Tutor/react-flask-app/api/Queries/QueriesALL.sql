#Get the list of classes based on the string input
#INPUT: Part of a class code
#OUTPUT: All relevant class codes
#WORKING: TESTED AND WORKING
SELECT class_code from Classes where instr(class_code, "COM");

#Get the professor information from classes you have
#INPUT: Classes that the student has
#OUTPUT: Professor Full Name, Office Hours and Office Location
#WORKING: TESTED AND WORKING
SELECT P.prof_fname, P.prof_lname, P.office_hours, P.office_location
FROM Professors P INNER JOIN
(SELECT prof_id FROM Classes
	where class_code IN
		(SELECT class_code FROM TakenClasses WHERE student_id = 254829)
) CP ON P.prof_id = CP.prof_id;

#Get tutors for a specific student
#INPUT: Class a tutor is needed for
#OUTPUT: Tutor Full Name, Verification, Payment info
#WORKING: TESTED AND WORKING
SELECT T.tutor_fname, T.tutor_lname, T.payment_info, T.payment_type, C.class_code
FROM Tutor T INNER JOIN 
(SELECT tutor_id, class_code FROM TutoredClasses 
	WHERE class_code IN 
		(SELECT class_code FROM TakenClasses WHERE student_id = 254829)
) C ON T.tutor_id = C.tutor_id;

#Get classes a student is taking
#INPUT: Student ID
#OUTPUT: Class Codes
#WORKING: TESTED AND WORKING
SELECT C.class_code, C.class_start, C.class_end
	FROM Classes C,
    Student S
    WHERE S.student_id IN (SELECT student_id FROM TakenClasses where student_id = 254829);

#save whether the person wants to log in as tutor or student
#INPUT: box value, tutor ID
#OUTPUT: None
#WORKING: TESTED AND WORKING
update Tutor set log_in_as_tutor = true where tutor_id = 1;

#retrieve what to log the person in as
#INPUT: Tutor ID
#OUTPUT: LogInAsTutor
#WORKING: TESTED AND WORKING
select log_in_as_tutor from Tutor where tutor_id = 1;

#save whether the tutor wants to be contacted for availability
#INPUT: Tutor ID, contact values
#OUTPUT: NONE
#WORKING: TESTED AND WORKING
update Tutor set contact_me = true where tutor_id = 1;

#retrieve whether the tutor wants to be contacted for availability
#INPUT: Tutor_ID
#OUTPUT: contact_me
#WORKING: TESTED AND WORKING
select contact_me from Tutor where tutor_id = 1;

#add a time a tutor is available
#INPUT: Tutor ID, Weekday, Start Time, End Time
#OUTPUT: NONE
#WORKING: TESTED AND WORKING
insert into TutorTimes values(1, 2, '3:00:00', '4:00:00');

#remove a time a tutor is available
#INPUT: Tutor ID, Weekday, Start Time, End Time
#OUTPUT: NONE
#WORKING: TESTED AND WORKING
delete from TutorTimes where tutor_id = 1 AND weekday = 2 AND start_time = '3:00:00';

#check the times a tutor is available
#INPUT: Tutor ID
#OUTPUT: All times the tutor is available
#WORKING: TESTED AND WORKING
select * from TutorTimes where tutor_id = 1;

#add a rate for a specific class
#INPUT: Tutor ID, rate, class code
#OUTPUT: NONE
#WORKING: TESTED AND WORKING
insert into TutorRates values(1, "COMP451", 20.00);

#remove a rate for a specific class
#INPUT: Tutor ID, class code
#OUTPUT: NONE
#WORKING: TESTED AND WORKING
delete from TutorRates where tutor_id = 1 AND class_code = "COMP451";

#see the rates for a tutor
#INPUT: Tutor ID
#OUTPUT: Rates for all their classes 
#WORKING: TESTED AND WORKING
select class_code, rate from TutorRates where tutor_id = 1;

#store payment methods
#INPUT: Tutor ID, Payment Method, Payment Details (Encrypted?)
#OUTPUT: none
#WORKING: TESTED AND WORKING
update Tutor set payment_type = "Venmo", payment_info = "iapel" where tutor_id = 1;

#retrieve payment methods
#INPUT: Tutor ID
#OUTPUT: Payment Method, Payment Details
#WORKING: TESTED AND WORKING
select payment_type, payment_info from Tutor where tutor_id = 1;