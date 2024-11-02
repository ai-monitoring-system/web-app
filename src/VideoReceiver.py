import asyncio
import websockets
import av
import io

async def video_receiver(websocket, path):
    print("WebSocket connection established")
    try:
        async for message in websocket:
            # Create a new container for each chunk
            container = av.open(io.BytesIO(message), format='webm')
            for frame in container.decode(video=0):
                # Display frame or process further
                print("Received frame:", frame)
    except websockets.exceptions.ConnectionClosed:
        print("WebSocket connection closed")
    except Exception as e:
        print("Error:", e)


if __name__ == "__main__":
    start_server = websockets.serve(video_receiver, "localhost", 8080)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
