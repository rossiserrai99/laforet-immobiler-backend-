const urls = [
  'https://res.cloudinary.com/zt28qj9l/video/upload/v1784947742/Video_Project_5_nkmuyt.mp4',
  'https://res.cloudinary.com/zt28qj9l/video/upload/v1784947742/Video_Project_5_nkmuyt.jpg',
  'https://res.cloudinary.com/zt28qj9l/image/upload/v1784965315/stock-photo-real-estate-agent-insurance-sales-representative-young-asian-businessman-handing_qyjsni.webp',
  'https://res.cloudinary.com/zt28qj9l/image/upload/v1784965809/make_picture_high_definition_res__202607250849_msbqp4.jpg',
  'https://res.cloudinary.com/zt28qj9l/image/upload/v1785037176/recreate_picture_high_quality_de__202607260438_tmgxak.jpg',
  'https://res.cloudinary.com/zt28qj9l/image/upload/v1784128157/laforet_properties/fjudyrta5bwvmvqtrauv.jpg',
  'https://res.cloudinary.com/zt28qj9l/image/upload/v1784949574/laforet_properties/acwvxzw7u7qyuyatx38s.jpg'
];

async function checkUrls() {
  for (const url of urls) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      console.log('URL:', url.split('/').slice(-2).join('/'));
      console.log('  Status:', res.status);
      console.log('  Content-Type:', res.headers.get('content-type'));
      console.log('  Content-Length (bytes):', res.headers.get('content-length'), `(${Math.round(Number(res.headers.get('content-length'))/1024)} KB)`);
      console.log('  X-Cld-Error:', res.headers.get('x-cld-error') || 'none');
    } catch (err) {
      console.error('Error fetching', url, err.message);
    }
  }
}
checkUrls();
