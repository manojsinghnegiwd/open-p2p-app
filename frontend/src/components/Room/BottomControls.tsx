import React from 'react';

const style = {
    position: 'fixed' as 'fixed',
    width: '100%',
    padding: 20,
    bottom: 0
}

interface BottomControlsProps {
    onLeave: () => void,
    toggleMute: () => void,
    toggleVideoMute: () => void,
    muted: boolean,
    videoMuted: boolean
}

const BottomControls: React.FC<BottomControlsProps> = ({
    onLeave,
    toggleMute,
    toggleVideoMute,
    muted,
    videoMuted,
}) => {
    return (
        <div className="has-text-centered mt-5" style={style}>
            <button className="button is-danger mr-2" onClick={onLeave}>
                <span className="icon">
                    <i className="fas fa-phone-slash"/>
                </span>
                <span>Leave call</span>
            </button>
            <button className={`button is-${muted ? 'danger' : 'primary' } mr-2`} onClick={toggleMute}>
                <span className="icon">
                    <i className={`fas ${muted ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
                </span>
                <span>{muted ? 'Unmute' : 'Mute'}</span>
            </button>
            <button className={`button is-${videoMuted ? 'danger' : 'primary' } mr-2`} onClick={toggleVideoMute}>
                <span className="icon">
                    <i className={`fas ${videoMuted ? 'fa-video-slash' : 'fa-video'}`}></i>
                </span>
                <span>{videoMuted ? 'Turn video on' : 'Turn video off'}</span>
            </button>
        </div>
    )
}

export default BottomControls;
