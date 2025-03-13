const createFormDataFromUri = (uri: string, clientId: number, tipoBiometria: string): FormData => {
    const uriParts = uri.split('.');
    const fileType = uriParts[uriParts.length - 1];
    
    let mimeType = 'image/jpeg';
    if (fileType.toLowerCase() === 'png') {
      mimeType = 'image/png';
    } else if (fileType.toLowerCase() === 'pdf') {
      mimeType = 'application/pdf';
    }

    const formData = new FormData();
    formData.append('file', {
      uri: uri,
      name: `facial_${clientId}.${fileType}`,
      type: mimeType,
    } as any);
    formData.append('metadata', JSON.stringify({ clienteId: clientId, tipoBiometria: tipoBiometria }));
    
    return formData;
  };
