//adding new chat documents
//setting up a real-time listener to get new chats
//updating the username
//updating the room

//manage te chatroom data
class Chatroom {
  constructor(room, username){
      this.room = room;
      this.username = username;
      this.AmacChat = collection(db, 'AmacChat');
      this.unsub;
  }
  async addChat(message){
      //format a chat object
      const now = new Date();
      const chat = {
          message,
          username: this.username,
          room: this.room,
          created_at: firebase.firestore.Timestamp.fromDate(now)
      };
      //save the chat document
      const response = await this.AmacChat.add(chat);
      return response;
  }
  getChats(callback){
      this.unsub = this.AmacChat
        .where('room', '==', this.room)
        .orderBy('created_at')
        .onSnapshot(snapshot =>{
          snapshot.docChanges().forEach(change =>{
              if(change.type ==='added'){
                //update the ui
                callback(change.doc.data())
              }
          });
      });

  }
  updateName(username){
      this.username = username;
      localStorage.setItem('username', username)
  }
  updateRoom(room){
      this.room = room;
      console.log('room updated');
      if(this.unsub){
          this.unsub();
      }
  }
}
export default Chatroom
// setTimeout(() => {
//     chatroom.updateRoom('gaming')
//     chatroom.getChats((data) =>{
//     console.log(data);
//     });
//     chatroom.addChat('hello');
// }, 3000);