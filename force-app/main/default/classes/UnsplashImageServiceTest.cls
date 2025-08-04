@IsTest
private class UnsplashImageServiceTest {
    class MockHttpResponseGenerator implements HttpCalloutMock {
        public HTTPResponse respond(HTTPRequest req) {
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');
            res.setBody('{"results":[{"urls":{"small_s3":"http://example.com/image.jpg"}}]}');
            res.setStatusCode(200);
            return res;
        }
    }

    @IsTest
    static void testFetchImageUrl() {
        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        String url = UnsplashImageService.fetchImageUrl('cat');
        System.assertEquals('http://example.com/image.jpg', url);
    }
}
