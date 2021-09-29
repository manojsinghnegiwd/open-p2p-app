import React, { useEffect, useRef } from 'react';

interface RemoteUserVideoProps {
    remoteStream: MediaStream | null
}

const RemoteUserVideo: React.FC<RemoteUserVideoProps> = ({
    remoteStream
}) => {
    const userVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (userVideoRef.current && remoteStream) {
            userVideoRef.current.srcObject = remoteStream
            userVideoRef.current.pause()
            userVideoRef.current.play().then(_ => {
                // Video playback started ;)
              })
              .catch(e => {
                console.log(e)
              });
        }
    }, [remoteStream])

    return (
        <div className="column is-narrow">
            <video ref={userVideoRef} />
        </div>
    )
}

export default RemoteUserVideo;
