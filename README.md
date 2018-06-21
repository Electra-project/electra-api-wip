# Welcome to Electra mobile wallet api

This API's let user manage their wallets and transactions from mobile App. Of the 5 modules, two module are built listed below while the other 3 modules are in WIP. 

> The Launch of first working version of this API's will be publically announced later.

---

## Authentication module
This module consists api for : 
* Creating session
* Registering a user
* Login
* Logout
* verifying 
* user status
* OTP
* resetting the password

---

## Non Secure MicroServices module
This module consists api for : 
* Checking the balance for a specific address
* Listing the transaction history for a specific address

---

### Getting Started with Authentication module

##### /security/createSession POST

 Creates a session and returns a unique token


| Parameters       |   Description                      |
| :----------------| ----------------------------------:|                   
|  **mobileNo**    |   Requires a valid mobile phone no . Required|
|  **uuid**        |   A uuid generated from mobile     . Required|               

The Token is valid for 1 hour and can't be customized by user. The token needs to be send with every request for using another API's of Security module.


---
##### /security/register POST

 Register the user data to online database


| Parameters              |   Description                      |
| :-----------------------| ----------------------------------:|                   
|  **firstname**          |   firstname of the user . alphabets only . Required  |
|  **lastname**           |   lastname of the user . alphabets only . Required   |               
|  **email**              |   Email address . Required     |               
|  **mobileNo**           |   Mobile no     . Required     |               
|  **token**              |   token return by the createsession api . Required  |               

This will return success message on user being successfully registered

---
##### /security/login POST

 Let the user login to access their data and manage wallet


| Parameters              |   Description                      |
| :-----------------------| ----------------------------------:|                   
|  **password**          |   firstname of the user . alphabets only . Required  |
|  **email**              |   Email address . Required     |               
|  **mobileNo**           |   Mobile no     . Required     |               
|  **token**              |   token return by the createsession api . Required  |               

This will return the public wallet address that the user have and a success message when the user successfully logins

---
##### /security/logout POST

 Let the user log out and destroy the session


| Parameters              |   Description                      |
| :-----------------------| ----------------------------------:|                               
|  **token**              |   token return by the createsession api . Required  |               

This will return the success message on user being successfullly logout of the system.

---
##### /security/verifyUser POST

 check the user session status, if the user has session and is logged in or not


| Parameters              |   Description                      |
| :-----------------------| ----------------------------------:|                               
|  **token**              |   token return by the createsession api . Required  |               

This will return the user status and success message on user being successfullly verifying the user session status.

---
##### /security/otp POST

 Let the user completes the signup process by submitting password and OTP (send via email) 


| Parameters              |   Description                      |
| :-----------------------| ----------------------------------:|                   
|  **password**          |   firstname of the user . alphabets only . Required  |
|  **email**              |   Email address . Required     |               
|  **otp**           |   A six digit code send via email     . Required     |               
|  **token**              |   token return by the createsession api . Required  |               

This will return the mnemonic phrase and success message on successfully completeing the sign up process
password format -> {Passwords must be between 8 and 20 characters and combine at least 3 of the following character types:.1) lower case letters, 2) uppercase letters, 3) numbers, 4) special characters ('! # $ * ? @ . - _' ;)}

---
##### /security/password POST

 Let the user resets the current password of the system


| Parameters              |   Description                      |
| :-----------------------| ----------------------------------:|                   
|  **email**              |   Email address . Required     |                            
|  **token**              |   token return by the createsession api . Required  |               

This will send the otp via email to that user, and returns the success message on succussfully password reset process.


---
### Getting Started with Non Secure MicroServices module


---
##### /passbook/balance POST

 checks the current balance of the public wallet address


| Parameters              |   Description                      |
| :-----------------------| ----------------------------------:|                   
|  **address**          |   public wallet address . Required  |
             

This will return the balance and success message on successfully checking the balance.


---
##### /passbook/listTransaction POST

 Fetches the transaction history of the wallet address.


| Parameters              |   Description                      |
| :-----------------------| ----------------------------------:|                   
|  **address**          |   public wallet address . Required  |
|  **count**          |   No of transaction user want to fetch . numeric only . Optional . Default 100  |
             

This will return the transaction history and success message on successfully finding transaction history