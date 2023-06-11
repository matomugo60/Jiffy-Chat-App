import React from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  // Add your Firebase configuration here
  apiKey: "AIzaSyBedX3ySvigzI0R_rzd8ptunM4qhTimKMg",
  authDomain: "chat-app-52f69.firebaseapp.com",
  projectId: "chat-app-52f69",
  storageBucket: "chat-app-52f69.appspot.com",
  messagingSenderId: "740712381082",
  appId: "1:740712381082:web:8478b785a14c9370373d23",
  measurementId: "G-1QFZL6NEK3"
});

const auth = firebase.auth() as firebase.auth.Auth;
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div>
      <header>
        <h1>Jiffy Chat</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}

function SignOut() {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
  );
}

function ChatRoom() {
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages, loading] = useCollectionData<Message>(query, { idField: 'id' });

  return (
    <div>
      {loading ? (
        <div>Loading messages...</div>
      ) : (
        <ul>
          {messages &&
            messages.map((message) => (
              <li key={message.id}>{message.text}</li>
            ))}
        </ul>
      )}
    </div>
  );
}

export default App;
