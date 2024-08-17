import { BaseException } from '../errors/common.error';
import { telegramBot } from '../telegram/telegram-bot';
import { StatusCodes } from './status-codes';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function globalErrorHandler(err, request, response, next) {
    telegramBot.sendMessage(`
      error while request to server. Unhandled exception
      \nip: ${request.ip}
      \nrequest url: ${request.url}
      \nrequest originalUrl: ${request.originalUrl}
      \nrequest baseUrl: ${request.baseUrl}
      \nrequest method: ${request.method}
      \nrequest path: ${request.path}
      \nuserId: ${request.user?.id}
      \n🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
      request headers: <pre><code class="language-json">${JSON.stringify(request.headers, null, 2)}</code></pre>
      \n🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
      request body: <pre><code class="language-json">${JSON.stringify(request.body, null, 2)}</code></pre>
      \n🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
      exception message: <pre><code class="language-json">${err.message}</code></pre>
      \n🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
      exception name: <pre><code class="language-json">${err.name}</code></pre>
      \n🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
      exception: <pre><code class="language-json">${JSON.stringify(err, null, 2)}</code></pre>
    `);
    console.error('================================ GLOBAL ERROR HANDLER =================================\n', err);
    if (err instanceof BaseException) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            ...err,
            // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            message: request.t(err.message.text, { replace: err.message.text }),
        });
    }
    const json = BaseException.UnknownError(null);
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        ...json,
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        message: request.t(json.message.text, { replace: json.message.text }),
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsLWVycm9yLWhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbW9uL3V0aWxpdHkvZ2xvYmFsLWVycm9yLWhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHN0MsNkRBQTZEO0FBQzdELE1BQU0sVUFBVSxrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsT0FBZ0IsRUFBRSxRQUFrQixFQUFFLElBQWtCO0lBQzlGLFdBQVcsQ0FBQyxXQUFXLENBQ3JCOztjQUVVLE9BQU8sQ0FBQyxFQUFFO3VCQUNELE9BQU8sQ0FBQyxHQUFHOytCQUNILE9BQU8sQ0FBQyxXQUFXOzJCQUN2QixPQUFPLENBQUMsT0FBTzswQkFDaEIsT0FBTyxDQUFDLE1BQU07d0JBQ2hCLE9BQU8sQ0FBQyxJQUFJO2tCQUNsQixPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUU7OzBEQUV3QixJQUFJLENBQUMsU0FBUyxDQUNoRSxPQUFPLENBQUMsT0FBTyxFQUNmLElBQUksRUFDSixDQUFDLENBQ0Y7O3VEQUVnRCxJQUFJLENBQUMsU0FBUyxDQUM3RCxPQUFPLENBQUMsSUFBSSxFQUNaLElBQUksRUFDSixDQUFDLENBQ0Y7OzREQUVxRCxHQUFHLENBQUMsT0FBTzs7eURBRWQsR0FBRyxDQUFDLElBQUk7O29EQUViLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7S0FDM0UsQ0FDRixDQUFDO0lBRUYsT0FBTyxDQUFDLEtBQUssQ0FDWCwyRkFBMkYsRUFDM0YsR0FBRyxDQUNKLENBQUM7SUFFRixJQUFJLEdBQUcsWUFBWSxhQUFhLEVBQUUsQ0FBQztRQUNqQyxPQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLHFCQUFxQixDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzdELEdBQUcsR0FBRztZQUNOLHlEQUF5RDtZQUN6RCxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQzNFLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxNQUFNLElBQUksR0FBRyxhQUFhLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlDLE9BQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMscUJBQXFCLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDN0QsR0FBRyxJQUFJO1FBQ1AseURBQXlEO1FBQ3pELE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBVyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDN0UsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRGdW5jdGlvbiwgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJztcclxuaW1wb3J0IHsgQmFzZUV4Y2VwdGlvbiB9IGZyb20gJy4uL2Vycm9ycy9jb21tb24uZXJyb3InO1xyXG5pbXBvcnQgeyB0ZWxlZ3JhbUJvdCB9IGZyb20gJy4uL3RlbGVncmFtL3RlbGVncmFtLWJvdCc7XHJcbmltcG9ydCB7IFN0YXR1c0NvZGVzIH0gZnJvbSAnLi9zdGF0dXMtY29kZXMnO1xyXG5pbXBvcnQgeyBWYWxpZGF0aW9uRXJyb3IgfSBmcm9tICdjbGFzcy12YWxpZGF0b3InO1xyXG5cclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xyXG5leHBvcnQgZnVuY3Rpb24gZ2xvYmFsRXJyb3JIYW5kbGVyKGVyciwgcmVxdWVzdDogUmVxdWVzdCwgcmVzcG9uc2U6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pIHtcclxuICB0ZWxlZ3JhbUJvdC5zZW5kTWVzc2FnZShcclxuICAgIGBcclxuICAgICAgZXJyb3Igd2hpbGUgcmVxdWVzdCB0byBzZXJ2ZXIuIFVuaGFuZGxlZCBleGNlcHRpb25cclxuICAgICAgXFxuaXA6ICR7cmVxdWVzdC5pcH1cclxuICAgICAgXFxucmVxdWVzdCB1cmw6ICR7cmVxdWVzdC51cmx9XHJcbiAgICAgIFxcbnJlcXVlc3Qgb3JpZ2luYWxVcmw6ICR7cmVxdWVzdC5vcmlnaW5hbFVybH1cclxuICAgICAgXFxucmVxdWVzdCBiYXNlVXJsOiAke3JlcXVlc3QuYmFzZVVybH1cclxuICAgICAgXFxucmVxdWVzdCBtZXRob2Q6ICR7cmVxdWVzdC5tZXRob2R9XHJcbiAgICAgIFxcbnJlcXVlc3QgcGF0aDogJHtyZXF1ZXN0LnBhdGh9XHJcbiAgICAgIFxcbnVzZXJJZDogJHtyZXF1ZXN0LnVzZXI/LmlkfVxyXG4gICAgICBcXG7wn5+i8J+fovCfn6Lwn5+i8J+fovCfn6Lwn5+i8J+fovCfn6Lwn5+i8J+fovCfn6JcclxuICAgICAgcmVxdWVzdCBoZWFkZXJzOiA8cHJlPjxjb2RlIGNsYXNzPVwibGFuZ3VhZ2UtanNvblwiPiR7SlNPTi5zdHJpbmdpZnkoXHJcbiAgICAgICAgcmVxdWVzdC5oZWFkZXJzLFxyXG4gICAgICAgIG51bGwsXHJcbiAgICAgICAgMixcclxuICAgICAgKX08L2NvZGU+PC9wcmU+XHJcbiAgICAgIFxcbvCfn6Lwn5+i8J+fovCfn6Lwn5+i8J+fovCfn6Lwn5+i8J+fovCfn6Lwn5+i8J+folxyXG4gICAgICByZXF1ZXN0IGJvZHk6IDxwcmU+PGNvZGUgY2xhc3M9XCJsYW5ndWFnZS1qc29uXCI+JHtKU09OLnN0cmluZ2lmeShcclxuICAgICAgICByZXF1ZXN0LmJvZHksXHJcbiAgICAgICAgbnVsbCxcclxuICAgICAgICAyLFxyXG4gICAgICApfTwvY29kZT48L3ByZT5cclxuICAgICAgXFxu8J+fovCfn6Lwn5+i8J+fovCfn6Lwn5+i8J+fovCfn6Lwn5+i8J+fovCfn6Lwn5+iXHJcbiAgICAgIGV4Y2VwdGlvbiBtZXNzYWdlOiA8cHJlPjxjb2RlIGNsYXNzPVwibGFuZ3VhZ2UtanNvblwiPiR7ZXJyLm1lc3NhZ2V9PC9jb2RlPjwvcHJlPlxyXG4gICAgICBcXG7wn5+i8J+fovCfn6Lwn5+i8J+fovCfn6Lwn5+i8J+fovCfn6Lwn5+i8J+fovCfn6JcclxuICAgICAgZXhjZXB0aW9uIG5hbWU6IDxwcmU+PGNvZGUgY2xhc3M9XCJsYW5ndWFnZS1qc29uXCI+JHtlcnIubmFtZX08L2NvZGU+PC9wcmU+XHJcbiAgICAgIFxcbvCfn6Lwn5+i8J+fovCfn6Lwn5+i8J+fovCfn6Lwn5+i8J+fovCfn6Lwn5+i8J+folxyXG4gICAgICBleGNlcHRpb246IDxwcmU+PGNvZGUgY2xhc3M9XCJsYW5ndWFnZS1qc29uXCI+JHtKU09OLnN0cmluZ2lmeShlcnIsIG51bGwsIDIpfTwvY29kZT48L3ByZT5cclxuICAgIGAsXHJcbiAgKTtcclxuXHJcbiAgY29uc29sZS5lcnJvcihcclxuICAgICc9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSBHTE9CQUwgRVJST1IgSEFORExFUiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cXG4nLFxyXG4gICAgZXJyLFxyXG4gICk7XHJcblxyXG4gIGlmIChlcnIgaW5zdGFuY2VvZiBCYXNlRXhjZXB0aW9uKSB7XHJcbiAgICByZXR1cm4gcmVzcG9uc2Uuc3RhdHVzKFN0YXR1c0NvZGVzLklOVEVSTkFMX1NFUlZFUl9FUlJPUikuc2VuZCh7XHJcbiAgICAgIC4uLmVycixcclxuICAgICAgLy8gISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhXHJcbiAgICAgIG1lc3NhZ2U6IHJlcXVlc3QudChlcnIubWVzc2FnZS50ZXh0IGFzIGFueSwgeyByZXBsYWNlOiBlcnIubWVzc2FnZS50ZXh0IH0pLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBqc29uID0gQmFzZUV4Y2VwdGlvbi5Vbmtub3duRXJyb3IobnVsbCk7XHJcbiAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1cyhTdGF0dXNDb2Rlcy5JTlRFUk5BTF9TRVJWRVJfRVJST1IpLnNlbmQoe1xyXG4gICAgLi4uanNvbixcclxuICAgIC8vICEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhIVxyXG4gICAgbWVzc2FnZTogcmVxdWVzdC50KGpzb24ubWVzc2FnZS50ZXh0IGFzIGFueSwgeyByZXBsYWNlOiBqc29uLm1lc3NhZ2UudGV4dCB9KSxcclxuICB9KTtcclxufVxyXG4iXX0=