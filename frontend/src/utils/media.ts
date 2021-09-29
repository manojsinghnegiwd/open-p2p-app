interface NavigatorExtended extends Navigator {
    webkitGetUserMedia: (constraints: MediaStreamConstraints, successCallback: any, errorCallback: any) => void
    mozGetUserMedia: (constraints: MediaStreamConstraints, successCallback: any, errorCallback: any) => void
}

export const getUserMediaPromise = (
    mediaConstraints: MediaStreamConstraints,
): Promise<MediaStream> => {
    const navigatorExtended: NavigatorExtended = navigator as NavigatorExtended;

    const getUserMedia = 
        (navigatorExtended as any).getUserMedia
        || navigatorExtended.webkitGetUserMedia
        || navigatorExtended.mozGetUserMedia;

    return new Promise((resolve, reject) => {
        getUserMedia(mediaConstraints, resolve, reject);
    });
}

