# 💬 Cloud Messaging Project

### Description

Created with using FCM Firebase Cloud Messaging Service, Firebase Admin, Firestore, NextJS, React Toastify, JavaScript.

The project constist of:

- after loading the page, a toast message appears, which then disappears automatically. This message is personalized by the fact that the push message content includes a token
- clicking the button downloads and lists all tokens from the database
- next to each of the listed tokens there is a button to send a direct message only to the indicated token
- the content of such a push message is personalized in such a way that the content includes information that it is a direct message and also this specific token
- if the token is out of date, information appears above it that it is outdated and next - is being removed from the database
- at the very top of this list with all tokens from the database there is a button to send a message to all tokens in the database
- the message is sent with the content that it is a multicast message
- in console.log there is a preview of which tokens sending ended with a success status, and which ones with a failure
- those tokens that are outdated are removed from the database
