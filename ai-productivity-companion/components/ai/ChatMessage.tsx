interface Props {
    message: any;
}

export default function ChatMessage({
    message
}: Props) {

    const isUser = message.role === "user";

    return (

        <div
            className={`flex ${isUser
                    ? "justify-end"
                    : "justify-start"
                }`}
        >

            <div
                className={`max-w-xl rounded-2xl px-5 py-3 ${isUser
                        ? "bg-black text-white"
                        : "bg-gray-100"
                    }`}
            >

                {message.content}

            </div>

        </div>

    );

}