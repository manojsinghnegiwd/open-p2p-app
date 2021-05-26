interface NavigatorExtended extends Navigator {
    webkitGetUserMedia: (constraints: MediaStreamConstraints, successCallback: NavigatorUserMediaSuccessCallback, errorCallback: NavigatorUserMediaErrorCallback) => void
    mozGetUserMedia: (constraints: MediaStreamConstraints, successCallback: NavigatorUserMediaSuccessCallback, errorCallback: NavigatorUserMediaErrorCallback) => void
}

export const getUserMediaPromise = (
    mediaConstraints: MediaStreamConstraints,
): Promise<MediaStream> => {
    const navigatorExtended: NavigatorExtended = navigator as NavigatorExtended;

    const getUserMedia = 
        navigatorExtended.getUserMedia
        || navigatorExtended.webkitGetUserMedia
        || navigatorExtended.mozGetUserMedia;

    return new Promise((resolve, reject) => {
        getUserMedia(mediaConstraints, resolve, reject);
    });
}

