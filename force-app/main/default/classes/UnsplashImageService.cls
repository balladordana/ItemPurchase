public with sharing class UnsplashImageService {
    private static final String UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';
    private static final String ACCESS_KEY = ''; 
    
    @AuraEnabled
    public static String fetchImageUrl(String query) {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(UNSPLASH_API_URL + '?query=' + EncodingUtil.urlEncode(query, 'UTF-8') + '&per_page=1');
        request.setMethod('GET');
        request.setHeader('Authorization', 'Client-ID ' + ACCESS_KEY);

        HttpResponse response = http.send(request);
        if (response.getStatusCode() == 200) {
            Map<String, Object> result = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            List<Object> photos = (List<Object>) result.get('results');
            if (!photos.isEmpty()) {
                Map<String, Object> firstPhoto = (Map<String, Object>) photos[0];
                Map<String, Object> urls = (Map<String, Object>) firstPhoto.get('urls');
                return (String) urls.get('small_s3'); 
            }
        }
        return null;
    }
}
