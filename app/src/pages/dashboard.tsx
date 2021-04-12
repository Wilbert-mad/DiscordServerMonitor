import React, { useEffect, useState } from 'react';
import Arrow from '../assets/arrow';
import ws from '../socketManager';
// import { eventEmitter, Events } from '../emiter';
// import LoaderComponent from '../loader';
// import Holder from '../Message.placeholder';
import type IMessage from '../typings/Message';

export interface Setting {
  I: number;
  TOKEN: string;
  LOGIN_TOKEN: string;
  eventsData: string;
}

const Message = ({ data }: { data: IMessage }) => {
  return (
    <div className="flex flex-row bg-dashboardMsg h-msg rounded-md mb-2">
      <div className="h-msg md:w-1/5 sm:w-1/6 text-center">
        <b className="text-2xl">Author</b>
        <br />
        <u className="text-xl">{`${data.author.username}#${data.author.discriminator}`}</u>
      </div>
      <span className="w-1 bg-gray-600 mr-2"></span>
      <div className="flex flex-wrap content-center h-full w-full text-xl lg:text-2xl">{data.content}</div>
      <div className="flex justify-end h-full">
        <Arrow className="h-full w-2/7 hover:shadow-lg p-5 lg:p-2" />
      </div>
    </div>
  );
};

const Messages = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    console.log(ws.ws.readyState);
  });
  ws.on('@messageCreate', (message: IMessage) => {
    console.log(message);

    setMessages([...messages, message]);
  });

  return (
    <>
      <div className="m-1 bg-backDrop">
        <input className="w-full focus:outline-none p-1 bg-gray-200" />
      </div>
      <div className="flex flex-col">
        {messages.map((msg, key) => (
          <Message key={key} data={(msg as unknown) as IMessage} />
        ))}
      </div>
    </>
  );
};

export default function Dashboard() {
  const [view] = useState('messages');

  return (
    <>
      <div className="p-3 bg-backDrop text-white">
        <span className="text-xl lg:text-2xl cursor-pointer">Messages</span>
      </div>
      <div className="bg-dashboardbg">{view === 'messages' && <Messages />}</div>
    </>
  );
}
