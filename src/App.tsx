import React from 'react';
import './App.css';

import firebase, { User } from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore'

import {ChatMessageProps, Message} from './types'

firebase.initializeApp({
  apiKey: "AIzaSyBedX3ySvigzI0R_rzd8ptunM4qhTimKMg",
  authDomain: "chat-app-52f69.firebaseapp.com",
  projectId: "chat-app-52f69",
  storageBucket: "chat-app-52f69.appspot.com",
  messagingSenderId: "740712381082",
  appId: "1:740712381082:web:8478b785a14c9370373d23",
  measurementId: "G-1QFZL6NEK3"
})

const auth = firebase.auth()
const firestore = firebase.firestore()

function SignIn(){
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
  }
  return <button onClick={signInWithGoogle}>Sign in with Google</button>
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatMessage(props : ChatMessageProps){
  const {text, uid, photoURL} = props.message
  const messageClass = auth.currentUser != null && uid === auth.currentUser.uid ? 'sent' : 'received'
  return <div className={`message ${messageClass}`}>
      <img src={photoURL}/>
      <p>{text}</p>
    </div>
}

function ChatRoom(){
  const messagesRef = firestore.collection('messages')
  const query = messagesRef.orderBy('createdAt').limit(25)

  const [messages] : [Message[] | undefined, boolean, Error | undefined] = useCollectionData<Message>(query, {idField: 'id'})

  const [formValue, setFormValue] = React.useState('')

  const dummy = React.useRef<HTMLDivElement>(null)

  const sendMessage = async(e : React.FormEvent) =>{
    e.preventDefault()
    const user = auth && auth.currentUser && auth.currentUser;

    const uid = user && user.uid
    const photoURL = user && user.photoURL

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('')
    dummy.current && dummy.current.scrollIntoView({behavior: 'smooth'})
  }

  return(
    <>
      <main>
        {
          messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)
        }
        <div ref={dummy}></div>
      </main>
      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={e => setFormValue(e.target.value)}
          />
        <button type="submit">Send</button>
      </form>
    </>
  )
}

function App() {
  const [user] = useAuthState(auth)
  return (
    <div className="App">
      <header className="App-header">
        <h1>Chat App</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom/> : <SignIn/>}
      </section>
    </div>
  );
}

export default App;
