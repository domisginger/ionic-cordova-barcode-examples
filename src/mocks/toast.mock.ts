export class ToastServiceMock {    
    toastSuccess(message): void {
        console.log('TOAST SUCCESS: ' + message);
        return;
    }

    toastInfo(message): void {
        console.log('TOAST INFO: ' + message);
        return;
    }

    toastWarning(message): void {
        console.log('TOAST WARNING: ' + message);
        return;
    }

    toastError(message): void {
        console.log('TOAST ERROR: ' + message);
        return;
    }

    clearToast(message): void {
        console.log('CLEAR TOAST');
        return;
    }
}