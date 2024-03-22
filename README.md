# InClass 1.0.0
## Student Attendance App <a href="https://youtu.be/DgPUneoP2Hg?si=mXx9pSS64FcmUk3O">(Demo)</a>

An attendance app built in the React Native library and used Firebase for user authentication and Firestore to Store User data.

### Flow of App
1. The user can Log into an Admin or Student account based on their role.
2. The user will be authenticated using Firebase and their details will be stored on Firestore.
3. Admin user will Enter the subject name and click on <code>Generate QR</code> button.
4. This will generate a unique QR code containing details that will be used when a user tries to mark attendance.
5. Conversely, when the user logs into the Student Page, he can scan the QR generated by the Admin.
6. If certain parameters match, attendance will be marked.
7. Admin can view the list of present students by clicking on <code>Expire QR</code> button.



### Screens
<img src="https://github.com/Coder-Rushabh/inclass/assets/47267236/e0bc7a7c-7afb-4c69-be1c-9ec1ffbfdfce" width="250" height="490" />

<img src="https://github.com/Coder-Rushabh/inclass/assets/47267236/96802ca9-31e7-4724-b995-f5992f1c45c2" width="250" height="490" />

<img src="https://github.com/Coder-Rushabh/inclass/assets/47267236/27ab8ac9-1716-4822-99a4-f27684cd8d83" width="250" height="490" />

<img src="https://github.com/Coder-Rushabh/inclass/assets/47267236/f87fd984-4052-4767-a998-040de6df6224" width="250" height="490" />

<img src="https://github.com/Coder-Rushabh/inclass/assets/47267236/3ed159fd-68fc-4e87-83f7-6b03e1d0ed33" width="250" height="490" />

<img src="https://github.com/Coder-Rushabh/inclass/assets/47267236/24127e02-eeb8-4026-8510-0631780d631b" width="250" height="490" />



### FireStore
![image](https://github.com/Coder-Rushabh/inclass/assets/47267236/27265f3e-4eb2-485b-9a4e-ee2bba12388f)

- FireStore contains three Collections: <code>admin, attendance, and students.</code>
- In <code>admin</code> and <code>student</code>, we store details of Admins and Students respectively.
- In <code>attendance</code> collection, we store details of students who scan the QR generated by Admin under <code>uid</code> created by Admin.


### Future Updates
1. A <code>Share QR</code> button on the Admins Screen, so that the admin can share the QR with students. Students' pages will have a <code>Gallery</code> button. They can open that QR image from the gallery and scan the QR directly.
2. <code>Hotspot Authentication</code>: To check that the students are scanning the QR in the Classroom only, we can share the Admin's mobile hotspot details in the QR. Students will be able to mark attendance only if there is the same hotspot discoverable on their mobile device too.







