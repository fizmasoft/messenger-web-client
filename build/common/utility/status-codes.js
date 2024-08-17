// Generated file. Do not edit
export var StatusCodes;
(function (StatusCodes) {
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.2.1
     *
     * This interim response indicates that everything so far is OK and that the client should continue with the request or ignore it if it is already finished.
     */
    StatusCodes[StatusCodes["CONTINUE"] = 100] = "CONTINUE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.2.2
     *
     * This code is sent in response to an Upgrade request header by the client, and indicates the protocol the server is switching too.
     */
    StatusCodes[StatusCodes["SWITCHING_PROTOCOLS"] = 101] = "SWITCHING_PROTOCOLS";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.1
     *
     * This code indicates that the server has received and is processing the request, but no response is available yet.
     */
    StatusCodes[StatusCodes["PROCESSING"] = 102] = "PROCESSING";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.1
     *
     * The request has succeeded. The meaning of a success varies depending on the HTTP method:
     * GET: The resource has been fetched and is transmitted in the message body.
     * HEAD: The entity headers are in the message body.
     * POST: The resource describing the result of the action is transmitted in the message body.
     * TRACE: The message body contains the request message as received by the server
     */
    StatusCodes[StatusCodes["OK"] = 200] = "OK";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.2
     *
     * The request has succeeded and a new resource has been created as a result of it. This is typically the response sent after a PUT request.
     */
    StatusCodes[StatusCodes["CREATED"] = 201] = "CREATED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.3
     *
     * The request has been received but not yet acted upon. It is non-committal, meaning that there is no way in HTTP to later send an asynchronous response indicating the outcome of processing the request. It is intended for cases where another process or server handles the request, or for batch processing.
     */
    StatusCodes[StatusCodes["ACCEPTED"] = 202] = "ACCEPTED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.4
     *
     * This response code means returned meta-information set is not exact set as available from the origin server, but collected from a local or a third party copy. Except this condition, 200 OK response should be preferred instead of this response.
     */
    StatusCodes[StatusCodes["NON_AUTHORITATIVE_INFORMATION"] = 203] = "NON_AUTHORITATIVE_INFORMATION";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.5
     *
     * There is no content to send for this request, but the headers may be useful. The user-agent may update its cached headers for this resource with the new ones.
     */
    StatusCodes[StatusCodes["NO_CONTENT"] = 204] = "NO_CONTENT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.3.6
     *
     * This response code is sent after accomplishing request to tell user agent reset document view which sent this request.
     */
    StatusCodes[StatusCodes["RESET_CONTENT"] = 205] = "RESET_CONTENT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7233#section-4.1
     *
     * This response code is used because of range header sent by the client to separate download into multiple streams.
     */
    StatusCodes[StatusCodes["PARTIAL_CONTENT"] = 206] = "PARTIAL_CONTENT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.2
     *
     * A Multi-Status response conveys information about multiple resources in situations where multiple status codes might be appropriate.
     */
    StatusCodes[StatusCodes["MULTI_STATUS"] = 207] = "MULTI_STATUS";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.1
     *
     * The request has more than one possible responses. User-agent or user should choose one of them. There is no standardized way to choose one of the responses.
     */
    StatusCodes[StatusCodes["MULTIPLE_CHOICES"] = 300] = "MULTIPLE_CHOICES";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.2
     *
     * This response code means that URI of requested resource has been changed. Probably, new URI would be given in the response.
     */
    StatusCodes[StatusCodes["MOVED_PERMANENTLY"] = 301] = "MOVED_PERMANENTLY";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.3
     *
     * This response code means that URI of requested resource has been changed temporarily. New changes in the URI might be made in the future. Therefore, this same URI should be used by the client in future requests.
     */
    StatusCodes[StatusCodes["MOVED_TEMPORARILY"] = 302] = "MOVED_TEMPORARILY";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.4
     *
     * Server sent this response to directing client to get requested resource to another URI with an GET request.
     */
    StatusCodes[StatusCodes["SEE_OTHER"] = 303] = "SEE_OTHER";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7232#section-4.1
     *
     * This is used for caching purposes. It is telling to client that response has not been modified. So, client can continue to use same cached version of response.
     */
    StatusCodes[StatusCodes["NOT_MODIFIED"] = 304] = "NOT_MODIFIED";
    /**
     * @deprecated
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.6
     *
     * Was defined in a previous version of the HTTP specification to indicate that a requested response must be accessed by a proxy. It has been deprecated due to security concerns regarding in-band configuration of a proxy.
     */
    StatusCodes[StatusCodes["USE_PROXY"] = 305] = "USE_PROXY";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.4.7
     *
     * Server sent this response to directing client to get requested resource to another URI with same method that used prior request. This has the same semantic than the 302 Found HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.
     */
    StatusCodes[StatusCodes["TEMPORARY_REDIRECT"] = 307] = "TEMPORARY_REDIRECT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7538#section-3
     *
     * This means that the resource is now permanently located at another URI, specified by the Location: HTTP Response header. This has the same semantics as the 301 Moved Permanently HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.
     */
    StatusCodes[StatusCodes["PERMANENT_REDIRECT"] = 308] = "PERMANENT_REDIRECT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.1
     *
     * This response means that server could not understand the request due to invalid syntax.
     */
    StatusCodes[StatusCodes["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7235#section-3.1
     *
     * Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.
     */
    StatusCodes[StatusCodes["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.2
     *
     * This response code is reserved for future use. Initial aim for creating this code was using it for digital payment systems however this is not used currently.
     */
    StatusCodes[StatusCodes["PAYMENT_REQUIRED"] = 402] = "PAYMENT_REQUIRED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.3
     *
     * The client does not have access rights to the content, i.e. they are unauthorized, so server is rejecting to give proper response. Unlike 401, the client's identity is known to the server.
     */
    StatusCodes[StatusCodes["FORBIDDEN"] = 403] = "FORBIDDEN";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.4
     *
     * The server can not find requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 to hide the existence of a resource from an unauthorized client. This response code is probably the most famous one due to its frequent occurrence on the web.
     */
    StatusCodes[StatusCodes["NOT_FOUND"] = 404] = "NOT_FOUND";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.5
     *
     * The request method is known by the server but has been disabled and cannot be used. For example, an API may forbid DELETE-ing a resource. The two mandatory methods, GET and HEAD, must never be disabled and should not return this error code.
     */
    StatusCodes[StatusCodes["METHOD_NOT_ALLOWED"] = 405] = "METHOD_NOT_ALLOWED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.6
     *
     * This response is sent when the web server, after performing server-driven content negotiation, doesn't find any content following the criteria given by the user agent.
     */
    StatusCodes[StatusCodes["NOT_ACCEPTABLE"] = 406] = "NOT_ACCEPTABLE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7235#section-3.2
     *
     * This is similar to 401 but authentication is needed to be done by a proxy.
     */
    StatusCodes[StatusCodes["PROXY_AUTHENTICATION_REQUIRED"] = 407] = "PROXY_AUTHENTICATION_REQUIRED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.7
     *
     * This response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection. This response is used much more since some browsers, like Chrome, Firefox 27+, or IE9, use HTTP pre-connection mechanisms to speed up surfing. Also note that some servers merely shut down the connection without sending this message.
     */
    StatusCodes[StatusCodes["REQUEST_TIMEOUT"] = 408] = "REQUEST_TIMEOUT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.8
     *
     * This response is sent when a request conflicts with the current state of the server.
     */
    StatusCodes[StatusCodes["CONFLICT"] = 409] = "CONFLICT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.9
     *
     * This response would be sent when the requested content has been permanently deleted from server, with no forwarding address. Clients are expected to remove their caches and links to the resource. The HTTP specification intends this status code to be used for "limited-time, promotional services". APIs should not feel compelled to indicate resources that have been deleted with this status code.
     */
    StatusCodes[StatusCodes["GONE"] = 410] = "GONE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.10
     *
     * The server rejected the request because the Content-Length header field is not defined and the server requires it.
     */
    StatusCodes[StatusCodes["LENGTH_REQUIRED"] = 411] = "LENGTH_REQUIRED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7232#section-4.2
     *
     * The client has indicated preconditions in its headers which the server does not meet.
     */
    StatusCodes[StatusCodes["PRECONDITION_FAILED"] = 412] = "PRECONDITION_FAILED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.11
     *
     * Request entity is larger than limits defined by server; the server might close the connection or return an Retry-After header field.
     */
    StatusCodes[StatusCodes["REQUEST_TOO_LONG"] = 413] = "REQUEST_TOO_LONG";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.12
     *
     * The URI requested by the client is longer than the server is willing to interpret.
     */
    StatusCodes[StatusCodes["REQUEST_URI_TOO_LONG"] = 414] = "REQUEST_URI_TOO_LONG";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.13
     *
     * The media format of the requested data is not supported by the server, so the server is rejecting the request.
     */
    StatusCodes[StatusCodes["UNSUPPORTED_MEDIA_TYPE"] = 415] = "UNSUPPORTED_MEDIA_TYPE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7233#section-4.4
     *
     * The range specified by the Range header field in the request can't be fulfilled; it's possible that the range is outside the size of the target URI's data.
     */
    StatusCodes[StatusCodes["REQUESTED_RANGE_NOT_SATISFIABLE"] = 416] = "REQUESTED_RANGE_NOT_SATISFIABLE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.5.14
     *
     * This response code means the expectation indicated by the Expect request header field can't be met by the server.
     */
    StatusCodes[StatusCodes["EXPECTATION_FAILED"] = 417] = "EXPECTATION_FAILED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2324#section-2.3.2
     *
     * Any attempt to brew coffee with a teapot should result in the error code "418 I'm a teapot". The resulting entity body MAY be short and stout.
     */
    StatusCodes[StatusCodes["IM_A_TEAPOT"] = 418] = "IM_A_TEAPOT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.6
     *
     * The 507 (Insufficient Storage) status code means the method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request. This condition is considered to be temporary. If the request which received this status code was the result of a user action, the request MUST NOT be repeated until it is requested by a separate user action.
     */
    StatusCodes[StatusCodes["INSUFFICIENT_SPACE_ON_RESOURCE"] = 419] = "INSUFFICIENT_SPACE_ON_RESOURCE";
    /**
     * @deprecated
     * Official Documentation @ https://tools.ietf.org/rfcdiff?difftype=--hwdiff&url2=draft-ietf-webdav-protocol-06.txt
     *
     * A deprecated response used by the Spring Framework when a method has failed.
     */
    StatusCodes[StatusCodes["METHOD_FAILURE"] = 420] = "METHOD_FAILURE";
    /**
     * Official Documentation @ https://datatracker.ietf.org/doc/html/rfc7540#section-9.1.2
     *
     * Defined in the specification of HTTP/2 to indicate that a server is not able to produce a response for the combination of scheme and authority that are included in the request URI.
     */
    StatusCodes[StatusCodes["MISDIRECTED_REQUEST"] = 421] = "MISDIRECTED_REQUEST";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.3
     *
     * The request was well-formed but was unable to be followed due to semantic errors.
     */
    StatusCodes[StatusCodes["UNPROCESSABLE_ENTITY"] = 422] = "UNPROCESSABLE_ENTITY";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.4
     *
     * The resource that is being accessed is locked.
     */
    StatusCodes[StatusCodes["LOCKED"] = 423] = "LOCKED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.5
     *
     * The request failed due to failure of a previous request.
     */
    StatusCodes[StatusCodes["FAILED_DEPENDENCY"] = 424] = "FAILED_DEPENDENCY";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-3
     *
     * The origin server requires the request to be conditional. Intended to prevent the 'lost update' problem, where a client GETs a resource's state, modifies it, and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict.
     */
    StatusCodes[StatusCodes["PRECONDITION_REQUIRED"] = 428] = "PRECONDITION_REQUIRED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-4
     *
     * The user has sent too many requests in a given amount of time ("rate limiting").
     */
    StatusCodes[StatusCodes["TOO_MANY_REQUESTS"] = 429] = "TOO_MANY_REQUESTS";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-5
     *
     * The server is unwilling to process the request because its header fields are too large. The request MAY be resubmitted after reducing the size of the request header fields.
     */
    StatusCodes[StatusCodes["REQUEST_HEADER_FIELDS_TOO_LARGE"] = 431] = "REQUEST_HEADER_FIELDS_TOO_LARGE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7725
     *
     * The user-agent requested a resource that cannot legally be provided, such as a web page censored by a government.
     */
    StatusCodes[StatusCodes["UNAVAILABLE_FOR_LEGAL_REASONS"] = 451] = "UNAVAILABLE_FOR_LEGAL_REASONS";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.1
     *
     * The server encountered an unexpected condition that prevented it from fulfilling the request.
     */
    StatusCodes[StatusCodes["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.2
     *
     * The request method is not supported by the server and cannot be handled. The only methods that servers are required to support (and therefore that must not return this code) are GET and HEAD.
     */
    StatusCodes[StatusCodes["NOT_IMPLEMENTED"] = 501] = "NOT_IMPLEMENTED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.3
     *
     * This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.
     */
    StatusCodes[StatusCodes["BAD_GATEWAY"] = 502] = "BAD_GATEWAY";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.4
     *
     * The server is not ready to handle the request. Base causes are a server that is down for maintenance or that is overloaded. Note that together with this response, a user-friendly page explaining the problem should be sent. This responses should be used for temporary conditions and the Retry-After: HTTP header should, if possible, contain the estimated time before the recovery of the service. The webmaster must also take care about the caching-related headers that are sent along with this response, as these temporary condition responses should usually not be cached.
     */
    StatusCodes[StatusCodes["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.5
     *
     * This error response is given when the server is acting as a gateway and cannot get a response in time.
     */
    StatusCodes[StatusCodes["GATEWAY_TIMEOUT"] = 504] = "GATEWAY_TIMEOUT";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc7231#section-6.6.6
     *
     * The HTTP version used in the request is not supported by the server.
     */
    StatusCodes[StatusCodes["HTTP_VERSION_NOT_SUPPORTED"] = 505] = "HTTP_VERSION_NOT_SUPPORTED";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc2518#section-10.6
     *
     * The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process.
     */
    StatusCodes[StatusCodes["INSUFFICIENT_STORAGE"] = 507] = "INSUFFICIENT_STORAGE";
    /**
     * Official Documentation @ https://tools.ietf.org/html/rfc6585#section-6
     *
     * The 511 status code indicates that the client needs to authenticate to gain network access.
     */
    StatusCodes[StatusCodes["NETWORK_AUTHENTICATION_REQUIRED"] = 511] = "NETWORK_AUTHENTICATION_REQUIRED";
})(StatusCodes || (StatusCodes = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHVzLWNvZGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1vbi91dGlsaXR5L3N0YXR1cy1jb2Rlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4QkFBOEI7QUFDOUIsTUFBTSxDQUFOLElBQVksV0F1Vlg7QUF2VkQsV0FBWSxXQUFXO0lBQ3JCOzs7O09BSUc7SUFDSCx1REFBYyxDQUFBO0lBQ2Q7Ozs7T0FJRztJQUNILDZFQUF5QixDQUFBO0lBQ3pCOzs7O09BSUc7SUFDSCwyREFBZ0IsQ0FBQTtJQUNoQjs7Ozs7Ozs7T0FRRztJQUNILDJDQUFRLENBQUE7SUFDUjs7OztPQUlHO0lBQ0gscURBQWEsQ0FBQTtJQUNiOzs7O09BSUc7SUFDSCx1REFBYyxDQUFBO0lBQ2Q7Ozs7T0FJRztJQUNILGlHQUFtQyxDQUFBO0lBQ25DOzs7O09BSUc7SUFDSCwyREFBZ0IsQ0FBQTtJQUNoQjs7OztPQUlHO0lBQ0gsaUVBQW1CLENBQUE7SUFDbkI7Ozs7T0FJRztJQUNILHFFQUFxQixDQUFBO0lBQ3JCOzs7O09BSUc7SUFDSCwrREFBa0IsQ0FBQTtJQUNsQjs7OztPQUlHO0lBQ0gsdUVBQXNCLENBQUE7SUFDdEI7Ozs7T0FJRztJQUNILHlFQUF1QixDQUFBO0lBQ3ZCOzs7O09BSUc7SUFDSCx5RUFBdUIsQ0FBQTtJQUN2Qjs7OztPQUlHO0lBQ0gseURBQWUsQ0FBQTtJQUNmOzs7O09BSUc7SUFDSCwrREFBa0IsQ0FBQTtJQUNsQjs7Ozs7T0FLRztJQUNILHlEQUFlLENBQUE7SUFDZjs7OztPQUlHO0lBQ0gsMkVBQXdCLENBQUE7SUFDeEI7Ozs7T0FJRztJQUNILDJFQUF3QixDQUFBO0lBQ3hCOzs7O09BSUc7SUFDSCw2REFBaUIsQ0FBQTtJQUNqQjs7OztPQUlHO0lBQ0gsK0RBQWtCLENBQUE7SUFDbEI7Ozs7T0FJRztJQUNILHVFQUFzQixDQUFBO0lBQ3RCOzs7O09BSUc7SUFDSCx5REFBZSxDQUFBO0lBQ2Y7Ozs7T0FJRztJQUNILHlEQUFlLENBQUE7SUFDZjs7OztPQUlHO0lBQ0gsMkVBQXdCLENBQUE7SUFDeEI7Ozs7T0FJRztJQUNILG1FQUFvQixDQUFBO0lBQ3BCOzs7O09BSUc7SUFDSCxpR0FBbUMsQ0FBQTtJQUNuQzs7OztPQUlHO0lBQ0gscUVBQXFCLENBQUE7SUFDckI7Ozs7T0FJRztJQUNILHVEQUFjLENBQUE7SUFDZDs7OztPQUlHO0lBQ0gsK0NBQVUsQ0FBQTtJQUNWOzs7O09BSUc7SUFDSCxxRUFBcUIsQ0FBQTtJQUNyQjs7OztPQUlHO0lBQ0gsNkVBQXlCLENBQUE7SUFDekI7Ozs7T0FJRztJQUNILHVFQUFzQixDQUFBO0lBQ3RCOzs7O09BSUc7SUFDSCwrRUFBMEIsQ0FBQTtJQUMxQjs7OztPQUlHO0lBQ0gsbUZBQTRCLENBQUE7SUFDNUI7Ozs7T0FJRztJQUNILHFHQUFxQyxDQUFBO0lBQ3JDOzs7O09BSUc7SUFDSCwyRUFBd0IsQ0FBQTtJQUN4Qjs7OztPQUlHO0lBQ0gsNkRBQWlCLENBQUE7SUFDakI7Ozs7T0FJRztJQUNILG1HQUFvQyxDQUFBO0lBQ3BDOzs7OztPQUtHO0lBQ0gsbUVBQW9CLENBQUE7SUFDcEI7Ozs7T0FJRztJQUNILDZFQUF5QixDQUFBO0lBQ3pCOzs7O09BSUc7SUFDSCwrRUFBMEIsQ0FBQTtJQUMxQjs7OztPQUlHO0lBQ0gsbURBQVksQ0FBQTtJQUNaOzs7O09BSUc7SUFDSCx5RUFBdUIsQ0FBQTtJQUN2Qjs7OztPQUlHO0lBQ0gsaUZBQTJCLENBQUE7SUFDM0I7Ozs7T0FJRztJQUNILHlFQUF1QixDQUFBO0lBQ3ZCOzs7O09BSUc7SUFDSCxxR0FBcUMsQ0FBQTtJQUNyQzs7OztPQUlHO0lBQ0gsaUdBQW1DLENBQUE7SUFDbkM7Ozs7T0FJRztJQUNILGlGQUEyQixDQUFBO0lBQzNCOzs7O09BSUc7SUFDSCxxRUFBcUIsQ0FBQTtJQUNyQjs7OztPQUlHO0lBQ0gsNkRBQWlCLENBQUE7SUFDakI7Ozs7T0FJRztJQUNILDZFQUF5QixDQUFBO0lBQ3pCOzs7O09BSUc7SUFDSCxxRUFBcUIsQ0FBQTtJQUNyQjs7OztPQUlHO0lBQ0gsMkZBQWdDLENBQUE7SUFDaEM7Ozs7T0FJRztJQUNILCtFQUEwQixDQUFBO0lBQzFCOzs7O09BSUc7SUFDSCxxR0FBcUMsQ0FBQTtBQUN2QyxDQUFDLEVBdlZXLFdBQVcsS0FBWCxXQUFXLFFBdVZ0QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEdlbmVyYXRlZCBmaWxlLiBEbyBub3QgZWRpdFxyXG5leHBvcnQgZW51bSBTdGF0dXNDb2RlcyB7XHJcbiAgLyoqXHJcbiAgICogT2ZmaWNpYWwgRG9jdW1lbnRhdGlvbiBAIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM3MjMxI3NlY3Rpb24tNi4yLjFcclxuICAgKlxyXG4gICAqIFRoaXMgaW50ZXJpbSByZXNwb25zZSBpbmRpY2F0ZXMgdGhhdCBldmVyeXRoaW5nIHNvIGZhciBpcyBPSyBhbmQgdGhhdCB0aGUgY2xpZW50IHNob3VsZCBjb250aW51ZSB3aXRoIHRoZSByZXF1ZXN0IG9yIGlnbm9yZSBpdCBpZiBpdCBpcyBhbHJlYWR5IGZpbmlzaGVkLlxyXG4gICAqL1xyXG4gIENPTlRJTlVFID0gMTAwLFxyXG4gIC8qKlxyXG4gICAqIE9mZmljaWFsIERvY3VtZW50YXRpb24gQCBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzIzMSNzZWN0aW9uLTYuMi4yXHJcbiAgICpcclxuICAgKiBUaGlzIGNvZGUgaXMgc2VudCBpbiByZXNwb25zZSB0byBhbiBVcGdyYWRlIHJlcXVlc3QgaGVhZGVyIGJ5IHRoZSBjbGllbnQsIGFuZCBpbmRpY2F0ZXMgdGhlIHByb3RvY29sIHRoZSBzZXJ2ZXIgaXMgc3dpdGNoaW5nIHRvby5cclxuICAgKi9cclxuICBTV0lUQ0hJTkdfUFJPVE9DT0xTID0gMTAxLFxyXG4gIC8qKlxyXG4gICAqIE9mZmljaWFsIERvY3VtZW50YXRpb24gQCBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMjUxOCNzZWN0aW9uLTEwLjFcclxuICAgKlxyXG4gICAqIFRoaXMgY29kZSBpbmRpY2F0ZXMgdGhhdCB0aGUgc2VydmVyIGhhcyByZWNlaXZlZCBhbmQgaXMgcHJvY2Vzc2luZyB0aGUgcmVxdWVzdCwgYnV0IG5vIHJlc3BvbnNlIGlzIGF2YWlsYWJsZSB5ZXQuXHJcbiAgICovXHJcbiAgUFJPQ0VTU0lORyA9IDEwMixcclxuICAvKipcclxuICAgKiBPZmZpY2lhbCBEb2N1bWVudGF0aW9uIEAgaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzcyMzEjc2VjdGlvbi02LjMuMVxyXG4gICAqXHJcbiAgICogVGhlIHJlcXVlc3QgaGFzIHN1Y2NlZWRlZC4gVGhlIG1lYW5pbmcgb2YgYSBzdWNjZXNzIHZhcmllcyBkZXBlbmRpbmcgb24gdGhlIEhUVFAgbWV0aG9kOlxyXG4gICAqIEdFVDogVGhlIHJlc291cmNlIGhhcyBiZWVuIGZldGNoZWQgYW5kIGlzIHRyYW5zbWl0dGVkIGluIHRoZSBtZXNzYWdlIGJvZHkuXHJcbiAgICogSEVBRDogVGhlIGVudGl0eSBoZWFkZXJzIGFyZSBpbiB0aGUgbWVzc2FnZSBib2R5LlxyXG4gICAqIFBPU1Q6IFRoZSByZXNvdXJjZSBkZXNjcmliaW5nIHRoZSByZXN1bHQgb2YgdGhlIGFjdGlvbiBpcyB0cmFuc21pdHRlZCBpbiB0aGUgbWVzc2FnZSBib2R5LlxyXG4gICAqIFRSQUNFOiBUaGUgbWVzc2FnZSBib2R5IGNvbnRhaW5zIHRoZSByZXF1ZXN0IG1lc3NhZ2UgYXMgcmVjZWl2ZWQgYnkgdGhlIHNlcnZlclxyXG4gICAqL1xyXG4gIE9LID0gMjAwLFxyXG4gIC8qKlxyXG4gICAqIE9mZmljaWFsIERvY3VtZW50YXRpb24gQCBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzIzMSNzZWN0aW9uLTYuMy4yXHJcbiAgICpcclxuICAgKiBUaGUgcmVxdWVzdCBoYXMgc3VjY2VlZGVkIGFuZCBhIG5ldyByZXNvdXJjZSBoYXMgYmVlbiBjcmVhdGVkIGFzIGEgcmVzdWx0IG9mIGl0LiBUaGlzIGlzIHR5cGljYWxseSB0aGUgcmVzcG9uc2Ugc2VudCBhZnRlciBhIFBVVCByZXF1ZXN0LlxyXG4gICAqL1xyXG4gIENSRUFURUQgPSAyMDEsXHJcbiAgLyoqXHJcbiAgICogT2ZmaWNpYWwgRG9jdW1lbnRhdGlvbiBAIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM3MjMxI3NlY3Rpb24tNi4zLjNcclxuICAgKlxyXG4gICAqIFRoZSByZXF1ZXN0IGhhcyBiZWVuIHJlY2VpdmVkIGJ1dCBub3QgeWV0IGFjdGVkIHVwb24uIEl0IGlzIG5vbi1jb21taXR0YWwsIG1lYW5pbmcgdGhhdCB0aGVyZSBpcyBubyB3YXkgaW4gSFRUUCB0byBsYXRlciBzZW5kIGFuIGFzeW5jaHJvbm91cyByZXNwb25zZSBpbmRpY2F0aW5nIHRoZSBvdXRjb21lIG9mIHByb2Nlc3NpbmcgdGhlIHJlcXVlc3QuIEl0IGlzIGludGVuZGVkIGZvciBjYXNlcyB3aGVyZSBhbm90aGVyIHByb2Nlc3Mgb3Igc2VydmVyIGhhbmRsZXMgdGhlIHJlcXVlc3QsIG9yIGZvciBiYXRjaCBwcm9jZXNzaW5nLlxyXG4gICAqL1xyXG4gIEFDQ0VQVEVEID0gMjAyLFxyXG4gIC8qKlxyXG4gICAqIE9mZmljaWFsIERvY3VtZW50YXRpb24gQCBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzIzMSNzZWN0aW9uLTYuMy40XHJcbiAgICpcclxuICAgKiBUaGlzIHJlc3BvbnNlIGNvZGUgbWVhbnMgcmV0dXJuZWQgbWV0YS1pbmZvcm1hdGlvbiBzZXQgaXMgbm90IGV4YWN0IHNldCBhcyBhdmFpbGFibGUgZnJvbSB0aGUgb3JpZ2luIHNlcnZlciwgYnV0IGNvbGxlY3RlZCBmcm9tIGEgbG9jYWwgb3IgYSB0aGlyZCBwYXJ0eSBjb3B5LiBFeGNlcHQgdGhpcyBjb25kaXRpb24sIDIwMCBPSyByZXNwb25zZSBzaG91bGQgYmUgcHJlZmVycmVkIGluc3RlYWQgb2YgdGhpcyByZXNwb25zZS5cclxuICAgKi9cclxuICBOT05fQVVUSE9SSVRBVElWRV9JTkZPUk1BVElPTiA9IDIwMyxcclxuICAvKipcclxuICAgKiBPZmZpY2lhbCBEb2N1bWVudGF0aW9uIEAgaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzcyMzEjc2VjdGlvbi02LjMuNVxyXG4gICAqXHJcbiAgICogVGhlcmUgaXMgbm8gY29udGVudCB0byBzZW5kIGZvciB0aGlzIHJlcXVlc3QsIGJ1dCB0aGUgaGVhZGVycyBtYXkgYmUgdXNlZnVsLiBUaGUgdXNlci1hZ2VudCBtYXkgdXBkYXRlIGl0cyBjYWNoZWQgaGVhZGVycyBmb3IgdGhpcyByZXNvdXJjZSB3aXRoIHRoZSBuZXcgb25lcy5cclxuICAgKi9cclxuICBOT19DT05URU5UID0gMjA0LFxyXG4gIC8qKlxyXG4gICAqIE9mZmljaWFsIERvY3VtZW50YXRpb24gQCBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzIzMSNzZWN0aW9uLTYuMy42XHJcbiAgICpcclxuICAgKiBUaGlzIHJlc3BvbnNlIGNvZGUgaXMgc2VudCBhZnRlciBhY2NvbXBsaXNoaW5nIHJlcXVlc3QgdG8gdGVsbCB1c2VyIGFnZW50IHJlc2V0IGRvY3VtZW50IHZpZXcgd2hpY2ggc2VudCB0aGlzIHJlcXVlc3QuXHJcbiAgICovXHJcbiAgUkVTRVRfQ09OVEVOVCA9IDIwNSxcclxuICAvKipcclxuICAgKiBPZmZpY2lhbCBEb2N1bWVudGF0aW9uIEAgaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzcyMzMjc2VjdGlvbi00LjFcclxuICAgKlxyXG4gICAqIFRoaXMgcmVzcG9uc2UgY29kZSBpcyB1c2VkIGJlY2F1c2Ugb2YgcmFuZ2UgaGVhZGVyIHNlbnQgYnkgdGhlIGNsaWVudCB0byBzZXBhcmF0ZSBkb3dubG9hZCBpbnRvIG11bHRpcGxlIHN0cmVhbXMuXHJcbiAgICovXHJcbiAgUEFSVElBTF9DT05URU5UID0gMjA2LFxyXG4gIC8qKlxyXG4gICAqIE9mZmljaWFsIERvY3VtZW50YXRpb24gQCBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMjUxOCNzZWN0aW9uLTEwLjJcclxuICAgKlxyXG4gICAqIEEgTXVsdGktU3RhdHVzIHJlc3BvbnNlIGNvbnZleXMgaW5mb3JtYXRpb24gYWJvdXQgbXVsdGlwbGUgcmVzb3VyY2VzIGluIHNpdHVhdGlvbnMgd2hlcmUgbXVsdGlwbGUgc3RhdHVzIGNvZGVzIG1pZ2h0IGJlIGFwcHJvcHJpYXRlLlxyXG4gICAqL1xyXG4gIE1VTFRJX1NUQVRVUyA9IDIwNyxcclxuICAvKipcclxuICAgKiBPZmZpY2lhbCBEb2N1bWVudGF0aW9uIEAgaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzcyMzEjc2VjdGlvbi02LjQuMVxyXG4gICAqXHJcbiAgICogVGhlIHJlcXVlc3QgaGFzIG1vcmUgdGhhbiBvbmUgcG9zc2libGUgcmVzcG9uc2VzLiBVc2VyLWFnZW50IG9yIHVzZXIgc2hvdWxkIGNob29zZSBvbmUgb2YgdGhlbS4gVGhlcmUgaXMgbm8gc3RhbmRhcmRpemVkIHdheSB0byBjaG9vc2Ugb25lIG9mIHRoZSByZXNwb25zZXMuXHJcbiAgICovXHJcbiAgTVVMVElQTEVfQ0hPSUNFUyA9IDMwMCxcclxuICAvKipcclxuICAgKiBPZmZpY2lhbCBEb2N1bWVudGF0aW9uIEAgaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzcyMzEjc2VjdGlvbi02LjQuMlxyXG4gICAqXHJcbiAgICogVGhpcyByZXNwb25zZSBjb2RlIG1lYW5zIHRoYXQgVVJJIG9mIHJlcXVlc3RlZCByZXNvdXJjZSBoYXMgYmVlbiBjaGFuZ2VkLiBQcm9iYWJseSwgbmV3IFVSSSB3b3VsZCBiZSBnaXZlbiBpbiB0aGUgcmVzcG9uc2UuXHJcbiAgICovXHJcbiAgTU9WRURfUEVSTUFORU5UTFkgPSAzMDEsXHJcbiAgLyoqXHJcbiAgICogT2ZmaWNpYWwgRG9jdW1lbnRhdGlvbiBAIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM3MjMxI3NlY3Rpb24tNi40LjNcclxuICAgKlxyXG4gICAqIFRoaXMgcmVzcG9uc2UgY29kZSBtZWFucyB0aGF0IFVSSSBvZiByZXF1ZXN0ZWQgcmVzb3VyY2UgaGFzIGJlZW4gY2hhbmdlZCB0ZW1wb3JhcmlseS4gTmV3IGNoYW5nZXMgaW4gdGhlIFVSSSBtaWdodCBiZSBtYWRlIGluIHRoZSBmdXR1cmUuIFRoZXJlZm9yZSwgdGhpcyBzYW1lIFVSSSBzaG91bGQgYmUgdXNlZCBieSB0aGUgY2xpZW50IGluIGZ1dHVyZSByZXF1ZXN0cy5cclxuICAgKi9cclxuICBNT1ZFRF9URU1QT1JBUklMWSA9IDMwMixcclxuICAvKipcclxuICAgKiBPZmZpY2lhbCBEb2N1bWVudGF0aW9uIEAgaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzcyMzEjc2VjdGlvbi02LjQuNFxyXG4gICAqXHJcbiAgICogU2VydmVyIHNlbnQgdGhpcyByZXNwb25zZSB0byBkaXJlY3RpbmcgY2xpZW50IHRvIGdldCByZXF1ZXN0ZWQgcmVzb3VyY2UgdG8gYW5vdGhlciBVUkkgd2l0aCBhbiBHRVQgcmVxdWVzdC5cclxuICAgKi9cclxuICBTRUVfT1RIRVIgPSAzMDMsXHJcbiAgLyoqXHJcbiAgICogT2ZmaWNpYWwgRG9jdW1lbnRhdGlvbiBAIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM3MjMyI3NlY3Rpb24tNC4xXHJcbiAgICpcclxuICAgKiBUaGlzIGlzIHVzZWQgZm9yIGNhY2hpbmcgcHVycG9zZXMuIEl0IGlzIHRlbGxpbmcgdG8gY2xpZW50IHRoYXQgcmVzcG9uc2UgaGFzIG5vdCBiZWVuIG1vZGlmaWVkLiBTbywgY2xpZW50IGNhbiBjb250aW51ZSB0byB1c2Ugc2FtZSBjYWNoZWQgdmVyc2lvbiBvZiByZXNwb25zZS5cclxuICAgKi9cclxuICBOT1RfTU9ESUZJRUQgPSAzMDQsXHJcbiAgLyoqXHJcbiAgICogQGRlcHJlY2F0ZWRcclxuICAgKiBPZmZpY2lhbCBEb2N1bWVudGF0aW9uIEAgaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzcyMzEjc2VjdGlvbi02LjQuNlxyXG4gICAqXHJcbiAgICogV2FzIGRlZmluZWQgaW4gYSBwcmV2aW91cyB2ZXJzaW9uIG9mIHRoZSBIVFRQIHNwZWNpZmljYXRpb24gdG8gaW5kaWNhdGUgdGhhdCBhIHJlcXVlc3RlZCByZXNwb25zZSBtdXN0IGJlIGFjY2Vzc2VkIGJ5IGEgcHJveHkuIEl0IGhhcyBiZWVuIGRlcHJlY2F0ZWQgZHVlIHRvIHNlY3VyaXR5IGNvbmNlcm5zIHJlZ2FyZGluZyBpbi1iYW5kIGNvbmZpZ3VyYXRpb24gb2YgYSBwcm94eS5cclxuICAgKi9cclxuICBVU0VfUFJPWFkgPSAzMDUsXHJcbiAgLyoqXHJcbiAgICogT2ZmaWNpYWwgRG9jdW1lbnRhdGlvbiBAIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM3MjMxI3NlY3Rpb24tNi40LjdcclxuICAgKlxyXG4gICAqIFNlcnZlciBzZW50IHRoaXMgcmVzcG9uc2UgdG8gZGlyZWN0aW5nIGNsaWVudCB0byBnZXQgcmVxdWVzdGVkIHJlc291cmNlIHRvIGFub3RoZXIgVVJJIHdpdGggc2FtZSBtZXRob2QgdGhhdCB1c2VkIHByaW9yIHJlcXVlc3QuIFRoaXMgaGFzIHRoZSBzYW1lIHNlbWFudGljIHRoYW4gdGhlIDMwMiBGb3VuZCBIVFRQIHJlc3BvbnNlIGNvZGUsIHdpdGggdGhlIGV4Y2VwdGlvbiB0aGF0IHRoZSB1c2VyIGFnZW50IG11c3Qgbm90IGNoYW5nZSB0aGUgSFRUUCBtZXRob2QgdXNlZDogaWYgYSBQT1NUIHdhcyB1c2VkIGluIHRoZSBmaXJzdCByZXF1ZXN0LCBhIFBPU1QgbXVzdCBiZSB1c2VkIGluIHRoZSBzZWNvbmQgcmVxdWVzdC5cclxuICAgKi9cclxuICBURU1QT1JBUllfUkVESVJFQ1QgPSAzMDcsXHJcbiAgLyoqXHJcbiAgICogT2ZmaWNpYWwgRG9jdW1lbnRhdGlvbiBAIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM3NTM4I3NlY3Rpb24tM1xyXG4gICAqXHJcbiAgICogVGhpcyBtZWFucyB0aGF0IHRoZSByZXNvdXJjZSBpcyBub3cgcGVybWFuZW50bHkgbG9jYXRlZCBhdCBhbm90aGVyIFVSSSwgc3BlY2lmaWVkIGJ5IHRoZSBMb2NhdGlvbjogSFRUUCBSZXNwb25zZSBoZWFkZXIuIFRoaXMgaGFzIHRoZSBzYW1lIHNlbWFudGljcyBhcyB0aGUgMzAxIE1vdmVkIFBlcm1hbmVudGx5IEhUVFAgcmVzcG9uc2UgY29kZSwgd2l0aCB0aGUgZXhjZXB0aW9uIHRoYXQgdGhlIHVzZXIgYWdlbnQgbXVzdCBub3QgY2hhbmdlIHRoZSBIVFRQIG1ldGhvZCB1c2VkOiBpZiBhIFBPU1Qgd2FzIHVzZWQgaW4gdGhlIGZpcnN0IHJlcXVlc3QsIGEgUE9TVCBtdXN0IGJlIHVzZWQgaW4gdGhlIHNlY29uZCByZXF1ZXN0LlxyXG4gICAqL1xyXG4gIFBFUk1BTkVOVF9SRURJUkVDVCA9IDMwOCxcclxuICAvKipcclxuICAgKiBPZmZpY2lhbCBEb2N1bWVudGF0aW9uIEAgaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzcyMzEjc2VjdGlvbi02LjUuMVxyXG4gICAqXHJcbiAgICogVGhpcyByZXNwb25zZSBtZWFucyB0aGF0IHNlcnZlciBjb3VsZCBub3QgdW5kZXJzdGFuZCB0aGUgcmVxdWVzdCBkdWUgdG8gaW52YWxpZCBzeW50YXguXHJcbiAgICovXHJcbiAgQkFEX1JFUVVFU1QgPSA0MDAsXHJcbiAgLyoqXHJcbiAgICogT2ZmaWNpYWwgRG9jdW1lbnRhdGlvbiBAIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM3MjM1I3NlY3Rpb24tMy4xXHJcbiAgICpcclxuICAgKiBBbHRob3VnaCB0aGUgSFRUUCBzdGFuZGFyZCBzcGVjaWZpZXMgXCJ1bmF1dGhvcml6ZWRcIiwgc2VtYW50aWNhbGx5IHRoaXMgcmVzcG9uc2UgbWVhbnMgXCJ1bmF1dGhlbnRpY2F0ZWRcIi4gVGhhdCBpcywgdGhlIGNsaWVudCBtdXN0IGF1dGhlbnRpY2F0ZSBpdHNlbGYgdG8gZ2V0IHRoZSByZXF1ZXN0ZWQgcmVzcG9uc2UuXHJcbiAgICovXHJcbiAgVU5BVVRIT1JJWkVEID0gNDAxLFxyXG4gIC8qKlxyXG4gICAqIE9mZmljaWFsIERvY3VtZW50YXRpb24gQCBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzIzMSNzZWN0aW9uLTYuNS4yXHJcbiAgICpcclxuICAgKiBUaGlzIHJlc3BvbnNlIGNvZGUgaXMgcmVzZXJ2ZWQgZm9yIGZ1dHVyZSB1c2UuIEluaXRpYWwgYWltIGZvciBjcmVhdGluZyB0aGlzIGNvZGUgd2FzIHVzaW5nIGl0IGZvciBkaWdpdGFsIHBheW1lbnQgc3lzdGVtcyBob3dldmVyIHRoaXMgaXMgbm90IHVzZWQgY3VycmVudGx5LlxyXG4gICAqL1xyXG4gIFBBWU1FTlRfUkVRVUlSRUQgPSA0MDIsXHJcbiAgLyoqXHJcbiAgICogT2ZmaWNpYWwgRG9jdW1lbnRhdGlvbiBAIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM3MjMxI3NlY3Rpb24tNi41LjNcclxuICAgKlxyXG4gICAqIFRoZSBjbGllbnQgZG9lcyBub3QgaGF2ZSBhY2Nlc3MgcmlnaHRzIHRvIHRoZSBjb250ZW50LCBpLmUuIHRoZXkgYXJlIHVuYXV0aG9yaXplZCwgc28gc2VydmVyIGlzIHJlamVjdGluZyB0byBnaXZlIHByb3BlciByZXNwb25zZS4gVW5saWtlIDQwMSwgdGhlIGNsaWVudCdzIGlkZW50aXR5IGlzIGtub3duIHRvIHRoZSBzZXJ2ZXIuXHJcbiAgICovXHJcbiAgRk9SQklEREVOID0gNDAzLFxyXG4gIC8qKlxyXG4gICAqIE9mZmljaWFsIERvY3VtZW50YXRpb24gQCBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzIzMSNzZWN0aW9uLTYuNS40XHJcbiAgICpcclxuICAgKiBUaGUgc2VydmVyIGNhbiBub3QgZmluZCByZXF1ZXN0ZWQgcmVzb3VyY2UuIEluIHRoZSBicm93c2VyLCB0aGlzIG1lYW5zIHRoZSBVUkwgaXMgbm90IHJlY29nbml6ZWQuIEluIGFuIEFQSSwgdGhpcyBjYW4gYWxzbyBtZWFuIHRoYXQgdGhlIGVuZHBvaW50IGlzIHZhbGlkIGJ1dCB0aGUgcmVzb3VyY2UgaXRzZWxmIGRvZXMgbm90IGV4aXN0LiBTZXJ2ZXJzIG1heSBhbHNvIHNlbmQgdGhpcyByZXNwb25zZSBpbnN0ZWFkIG9mIDQwMyB0byBoaWRlIHRoZSBleGlzdGVuY2Ugb2YgYSByZXNvdXJjZSBmcm9tIGFuIHVuYXV0aG9yaXplZCBjbGllbnQuIFRoaXMgcmVzcG9uc2UgY29kZSBpcyBwcm9iYWJseSB0aGUgbW9zdCBmYW1vdXMgb25lIGR1ZSB0byBpdHMgZnJlcXVlbnQgb2NjdXJyZW5jZSBvbiB0aGUgd2ViLlxyXG4gICAqL1xyXG4gIE5PVF9GT1VORCA9IDQwNCxcclxuICAvKipcclxuICAgKiBPZmZpY2lhbCBEb2N1bWVudGF0aW9uIEAgaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzcyMzEjc2VjdGlvbi02LjUuNVxyXG4gICAqXHJcbiAgICogVGhlIHJlcXVlc3QgbWV0aG9kIGlzIGtub3duIGJ5IHRoZSBzZXJ2ZXIgYnV0IGhhcyBiZWVuIGRpc2FibGVkIGFuZCBjYW5ub3QgYmUgdXNlZC4gRm9yIGV4YW1wbGUsIGFuIEFQSSBtYXkgZm9yYmlkIERFTEVURS1pbmcgYSByZXNvdXJjZS4gVGhlIHR3byBtYW5kYXRvcnkgbWV0aG9kcywgR0VUIGFuZCBIRUFELCBtdXN0IG5ldmVyIGJlIGRpc2FibGVkIGFuZCBzaG91bGQgbm90IHJldHVybiB0aGlzIGVycm9yIGNvZGUuXHJcbiAgICovXHJcbiAgTUVUSE9EX05PVF9BTExPV0VEID0gNDA1LFxyXG4gIC8qKlxyXG4gICAqIE9mZmljaWFsIERvY3VtZW50YXRpb24gQCBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzIzMSNzZWN0aW9uLTYuNS42XHJcbiAgICpcclxuICAgKiBUaGlzIHJlc3BvbnNlIGlzIHNlbnQgd2hlbiB0aGUgd2ViIHNlcnZlciwgYWZ0ZXIgcGVyZm9ybWluZyBzZXJ2ZXItZHJpdmVuIGNvbnRlbnQgbmVnb3RpYXRpb24sIGRvZXNuJ3QgZmluZCBhbnkgY29udGVudCBmb2xsb3dpbmcgdGhlIGNyaXRlcmlhIGdpdmVuIGJ5IHRoZSB1c2VyIGFnZW50LlxyXG4gICAqL1xyXG4gIE5PVF9BQ0NFUFRBQkxFID0gNDA2LFxyXG4gIC8qKlxyXG4gICAqIE9mZmljaWFsIERvY3VtZW50YXRpb24gQCBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzIzNSNzZWN0aW9uLTMuMlxyXG4gICAqXHJcbiAgICogVGhpcyBpcyBzaW1pbGFyIHRvIDQwMSBidXQgYXV0aGVudGljYXRpb24gaXMgbmVlZGVkIHRvIGJlIGRvbmUgYnkgYSBwcm94eS5cclxuICAgKi9cclxuICBQUk9YWV9BVVRIRU5USUNBVElPTl9SRVFVSVJFRCA9IDQwNyxcclxuICAvKipcclxuICAgKiBPZmZpY2lhbCBEb2N1bWVudGF0aW9uIEAgaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzcyMzEjc2VjdGlvbi02LjUuN1xyXG4gICAqXHJcbiAgICogVGhpcyByZXNwb25zZSBpcyBzZW50IG9uIGFuIGlkbGUgY29ubmVjdGlvbiBieSBzb21lIHNlcnZlcnMsIGV2ZW4gd2l0aG91dCBhbnkgcHJldmlvdXMgcmVxdWVzdCBieSB0aGUgY2xpZW50LiBJdCBtZWFucyB0aGF0IHRoZSBzZXJ2ZXIgd291bGQgbGlrZSB0byBzaHV0IGRvd24gdGhpcyB1bnVzZWQgY29ubmVjdGlvbi4gVGhpcyByZXNwb25zZSBpcyB1c2VkIG11Y2ggbW9yZSBzaW5jZSBzb21lIGJyb3dzZXJzLCBsaWtlIENocm9tZSwgRmlyZWZveCAyNyssIG9yIElFOSwgdXNlIEhUVFAgcHJlLWNvbm5lY3Rpb24gbWVjaGFuaXNtcyB0byBzcGVlZCB1cCBzdXJmaW5nLiBBbHNvIG5vdGUgdGhhdCBzb21lIHNlcnZlcnMgbWVyZWx5IHNodXQgZG93biB0aGUgY29ubmVjdGlvbiB3aXRob3V0IHNlbmRpbmcgdGhpcyBtZXNzYWdlLlxyXG4gICAqL1xyXG4gIFJFUVVFU1RfVElNRU9VVCA9IDQwOCxcclxuICAvKipcclxuICAgKiBPZmZpY2lhbCBEb2N1bWVudGF0aW9uIEAgaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzcyMzEjc2VjdGlvbi02LjUuOFxyXG4gICAqXHJcbiAgICogVGhpcyByZXNwb25zZSBpcyBzZW50IHdoZW4gYSByZXF1ZXN0IGNvbmZsaWN0cyB3aXRoIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBzZXJ2ZXIuXHJcbiAgICovXHJcbiAgQ09ORkxJQ1QgPSA0MDksXHJcbiAgLyoqXHJcbiAgICogT2ZmaWNpYWwgRG9jdW1lbnRhdGlvbiBAIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM3MjMxI3NlY3Rpb24tNi41LjlcclxuICAgKlxyXG4gICAqIFRoaXMgcmVzcG9uc2Ugd291bGQgYmUgc2VudCB3aGVuIHRoZSByZXF1ZXN0ZWQgY29udGVudCBoYXMgYmVlbiBwZXJtYW5lbnRseSBkZWxldGVkIGZyb20gc2VydmVyLCB3aXRoIG5vIGZvcndhcmRpbmcgYWRkcmVzcy4gQ2xpZW50cyBhcmUgZXhwZWN0ZWQgdG8gcmVtb3ZlIHRoZWlyIGNhY2hlcyBhbmQgbGlua3MgdG8gdGhlIHJlc291cmNlLiBUaGUgSFRUUCBzcGVjaWZpY2F0aW9uIGludGVuZHMgdGhpcyBzdGF0dXMgY29kZSB0byBiZSB1c2VkIGZvciBcImxpbWl0ZWQtdGltZSwgcHJvbW90aW9uYWwgc2VydmljZXNcIi4gQVBJcyBzaG91bGQgbm90IGZlZWwgY29tcGVsbGVkIHRvIGluZGljYXRlIHJlc291cmNlcyB0aGF0IGhhdmUgYmVlbiBkZWxldGVkIHdpdGggdGhpcyBzdGF0dXMgY29kZS5cclxuICAgKi9cclxuICBHT05FID0gNDEwLFxyXG4gIC8qKlxyXG4gICAqIE9mZmljaWFsIERvY3VtZW50YXRpb24gQCBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzIzMSNzZWN0aW9uLTYuNS4xMFxyXG4gICAqXHJcbiAgICogVGhlIHNlcnZlciByZWplY3RlZCB0aGUgcmVxdWVzdCBiZWNhdXNlIHRoZSBDb250ZW50LUxlbmd0aCBoZWFkZXIgZmllbGQgaXMgbm90IGRlZmluZWQgYW5kIHRoZSBzZXJ2ZXIgcmVxdWlyZXMgaXQuXHJcbiAgICovXHJcbiAgTEVOR1RIX1JFUVVJUkVEID0gNDExLFxyXG4gIC8qKlxyXG4gICAqIE9mZmljaWFsIERvY3VtZW50YXRpb24gQCBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzIzMiNzZWN0aW9uLTQuMlxyXG4gICAqXHJcbiAgICogVGhlIGNsaWVudCBoYXMgaW5kaWNhdGVkIHByZWNvbmRpdGlvbnMgaW4gaXRzIGhlYWRlcnMgd2hpY2ggdGhlIHNlcnZlciBkb2VzIG5vdCBtZWV0LlxyXG4gICAqL1xyXG4gIFBSRUNPTkRJVElPTl9GQUlMRUQgPSA0MTIsXHJcbiAgLyoqXHJcbiAgICogT2ZmaWNpYWwgRG9jdW1lbnRhdGlvbiBAIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM3MjMxI3NlY3Rpb24tNi41LjExXHJcbiAgICpcclxuICAgKiBSZXF1ZXN0IGVudGl0eSBpcyBsYXJnZXIgdGhhbiBsaW1pdHMgZGVmaW5lZCBieSBzZXJ2ZXI7IHRoZSBzZXJ2ZXIgbWlnaHQgY2xvc2UgdGhlIGNvbm5lY3Rpb24gb3IgcmV0dXJuIGFuIFJldHJ5LUFmdGVyIGhlYWRlciBmaWVsZC5cclxuICAgKi9cclxuICBSRVFVRVNUX1RPT19MT05HID0gNDEzLFxyXG4gIC8qKlxyXG4gICAqIE9mZmljaWFsIERvY3VtZW50YXRpb24gQCBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzIzMSNzZWN0aW9uLTYuNS4xMlxyXG4gICAqXHJcbiAgICogVGhlIFVSSSByZXF1ZXN0ZWQgYnkgdGhlIGNsaWVudCBpcyBsb25nZXIgdGhhbiB0aGUgc2VydmVyIGlzIHdpbGxpbmcgdG8gaW50ZXJwcmV0LlxyXG4gICAqL1xyXG4gIFJFUVVFU1RfVVJJX1RPT19MT05HID0gNDE0LFxyXG4gIC8qKlxyXG4gICAqIE9mZmljaWFsIERvY3VtZW50YXRpb24gQCBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzIzMSNzZWN0aW9uLTYuNS4xM1xyXG4gICAqXHJcbiAgICogVGhlIG1lZGlhIGZvcm1hdCBvZiB0aGUgcmVxdWVzdGVkIGRhdGEgaXMgbm90IHN1cHBvcnRlZCBieSB0aGUgc2VydmVyLCBzbyB0aGUgc2VydmVyIGlzIHJlamVjdGluZyB0aGUgcmVxdWVzdC5cclxuICAgKi9cclxuICBVTlNVUFBPUlRFRF9NRURJQV9UWVBFID0gNDE1LFxyXG4gIC8qKlxyXG4gICAqIE9mZmljaWFsIERvY3VtZW50YXRpb24gQCBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzIzMyNzZWN0aW9uLTQuNFxyXG4gICAqXHJcbiAgICogVGhlIHJhbmdlIHNwZWNpZmllZCBieSB0aGUgUmFuZ2UgaGVhZGVyIGZpZWxkIGluIHRoZSByZXF1ZXN0IGNhbid0IGJlIGZ1bGZpbGxlZDsgaXQncyBwb3NzaWJsZSB0aGF0IHRoZSByYW5nZSBpcyBvdXRzaWRlIHRoZSBzaXplIG9mIHRoZSB0YXJnZXQgVVJJJ3MgZGF0YS5cclxuICAgKi9cclxuICBSRVFVRVNURURfUkFOR0VfTk9UX1NBVElTRklBQkxFID0gNDE2LFxyXG4gIC8qKlxyXG4gICAqIE9mZmljaWFsIERvY3VtZW50YXRpb24gQCBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzIzMSNzZWN0aW9uLTYuNS4xNFxyXG4gICAqXHJcbiAgICogVGhpcyByZXNwb25zZSBjb2RlIG1lYW5zIHRoZSBleHBlY3RhdGlvbiBpbmRpY2F0ZWQgYnkgdGhlIEV4cGVjdCByZXF1ZXN0IGhlYWRlciBmaWVsZCBjYW4ndCBiZSBtZXQgYnkgdGhlIHNlcnZlci5cclxuICAgKi9cclxuICBFWFBFQ1RBVElPTl9GQUlMRUQgPSA0MTcsXHJcbiAgLyoqXHJcbiAgICogT2ZmaWNpYWwgRG9jdW1lbnRhdGlvbiBAIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMyMzI0I3NlY3Rpb24tMi4zLjJcclxuICAgKlxyXG4gICAqIEFueSBhdHRlbXB0IHRvIGJyZXcgY29mZmVlIHdpdGggYSB0ZWFwb3Qgc2hvdWxkIHJlc3VsdCBpbiB0aGUgZXJyb3IgY29kZSBcIjQxOCBJJ20gYSB0ZWFwb3RcIi4gVGhlIHJlc3VsdGluZyBlbnRpdHkgYm9keSBNQVkgYmUgc2hvcnQgYW5kIHN0b3V0LlxyXG4gICAqL1xyXG4gIElNX0FfVEVBUE9UID0gNDE4LFxyXG4gIC8qKlxyXG4gICAqIE9mZmljaWFsIERvY3VtZW50YXRpb24gQCBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMjUxOCNzZWN0aW9uLTEwLjZcclxuICAgKlxyXG4gICAqIFRoZSA1MDcgKEluc3VmZmljaWVudCBTdG9yYWdlKSBzdGF0dXMgY29kZSBtZWFucyB0aGUgbWV0aG9kIGNvdWxkIG5vdCBiZSBwZXJmb3JtZWQgb24gdGhlIHJlc291cmNlIGJlY2F1c2UgdGhlIHNlcnZlciBpcyB1bmFibGUgdG8gc3RvcmUgdGhlIHJlcHJlc2VudGF0aW9uIG5lZWRlZCB0byBzdWNjZXNzZnVsbHkgY29tcGxldGUgdGhlIHJlcXVlc3QuIFRoaXMgY29uZGl0aW9uIGlzIGNvbnNpZGVyZWQgdG8gYmUgdGVtcG9yYXJ5LiBJZiB0aGUgcmVxdWVzdCB3aGljaCByZWNlaXZlZCB0aGlzIHN0YXR1cyBjb2RlIHdhcyB0aGUgcmVzdWx0IG9mIGEgdXNlciBhY3Rpb24sIHRoZSByZXF1ZXN0IE1VU1QgTk9UIGJlIHJlcGVhdGVkIHVudGlsIGl0IGlzIHJlcXVlc3RlZCBieSBhIHNlcGFyYXRlIHVzZXIgYWN0aW9uLlxyXG4gICAqL1xyXG4gIElOU1VGRklDSUVOVF9TUEFDRV9PTl9SRVNPVVJDRSA9IDQxOSxcclxuICAvKipcclxuICAgKiBAZGVwcmVjYXRlZFxyXG4gICAqIE9mZmljaWFsIERvY3VtZW50YXRpb24gQCBodHRwczovL3Rvb2xzLmlldGYub3JnL3JmY2RpZmY/ZGlmZnR5cGU9LS1od2RpZmYmdXJsMj1kcmFmdC1pZXRmLXdlYmRhdi1wcm90b2NvbC0wNi50eHRcclxuICAgKlxyXG4gICAqIEEgZGVwcmVjYXRlZCByZXNwb25zZSB1c2VkIGJ5IHRoZSBTcHJpbmcgRnJhbWV3b3JrIHdoZW4gYSBtZXRob2QgaGFzIGZhaWxlZC5cclxuICAgKi9cclxuICBNRVRIT0RfRkFJTFVSRSA9IDQyMCxcclxuICAvKipcclxuICAgKiBPZmZpY2lhbCBEb2N1bWVudGF0aW9uIEAgaHR0cHM6Ly9kYXRhdHJhY2tlci5pZXRmLm9yZy9kb2MvaHRtbC9yZmM3NTQwI3NlY3Rpb24tOS4xLjJcclxuICAgKlxyXG4gICAqIERlZmluZWQgaW4gdGhlIHNwZWNpZmljYXRpb24gb2YgSFRUUC8yIHRvIGluZGljYXRlIHRoYXQgYSBzZXJ2ZXIgaXMgbm90IGFibGUgdG8gcHJvZHVjZSBhIHJlc3BvbnNlIGZvciB0aGUgY29tYmluYXRpb24gb2Ygc2NoZW1lIGFuZCBhdXRob3JpdHkgdGhhdCBhcmUgaW5jbHVkZWQgaW4gdGhlIHJlcXVlc3QgVVJJLlxyXG4gICAqL1xyXG4gIE1JU0RJUkVDVEVEX1JFUVVFU1QgPSA0MjEsXHJcbiAgLyoqXHJcbiAgICogT2ZmaWNpYWwgRG9jdW1lbnRhdGlvbiBAIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMyNTE4I3NlY3Rpb24tMTAuM1xyXG4gICAqXHJcbiAgICogVGhlIHJlcXVlc3Qgd2FzIHdlbGwtZm9ybWVkIGJ1dCB3YXMgdW5hYmxlIHRvIGJlIGZvbGxvd2VkIGR1ZSB0byBzZW1hbnRpYyBlcnJvcnMuXHJcbiAgICovXHJcbiAgVU5QUk9DRVNTQUJMRV9FTlRJVFkgPSA0MjIsXHJcbiAgLyoqXHJcbiAgICogT2ZmaWNpYWwgRG9jdW1lbnRhdGlvbiBAIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMyNTE4I3NlY3Rpb24tMTAuNFxyXG4gICAqXHJcbiAgICogVGhlIHJlc291cmNlIHRoYXQgaXMgYmVpbmcgYWNjZXNzZWQgaXMgbG9ja2VkLlxyXG4gICAqL1xyXG4gIExPQ0tFRCA9IDQyMyxcclxuICAvKipcclxuICAgKiBPZmZpY2lhbCBEb2N1bWVudGF0aW9uIEAgaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzI1MTgjc2VjdGlvbi0xMC41XHJcbiAgICpcclxuICAgKiBUaGUgcmVxdWVzdCBmYWlsZWQgZHVlIHRvIGZhaWx1cmUgb2YgYSBwcmV2aW91cyByZXF1ZXN0LlxyXG4gICAqL1xyXG4gIEZBSUxFRF9ERVBFTkRFTkNZID0gNDI0LFxyXG4gIC8qKlxyXG4gICAqIE9mZmljaWFsIERvY3VtZW50YXRpb24gQCBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNjU4NSNzZWN0aW9uLTNcclxuICAgKlxyXG4gICAqIFRoZSBvcmlnaW4gc2VydmVyIHJlcXVpcmVzIHRoZSByZXF1ZXN0IHRvIGJlIGNvbmRpdGlvbmFsLiBJbnRlbmRlZCB0byBwcmV2ZW50IHRoZSAnbG9zdCB1cGRhdGUnIHByb2JsZW0sIHdoZXJlIGEgY2xpZW50IEdFVHMgYSByZXNvdXJjZSdzIHN0YXRlLCBtb2RpZmllcyBpdCwgYW5kIFBVVHMgaXQgYmFjayB0byB0aGUgc2VydmVyLCB3aGVuIG1lYW53aGlsZSBhIHRoaXJkIHBhcnR5IGhhcyBtb2RpZmllZCB0aGUgc3RhdGUgb24gdGhlIHNlcnZlciwgbGVhZGluZyB0byBhIGNvbmZsaWN0LlxyXG4gICAqL1xyXG4gIFBSRUNPTkRJVElPTl9SRVFVSVJFRCA9IDQyOCxcclxuICAvKipcclxuICAgKiBPZmZpY2lhbCBEb2N1bWVudGF0aW9uIEAgaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzY1ODUjc2VjdGlvbi00XHJcbiAgICpcclxuICAgKiBUaGUgdXNlciBoYXMgc2VudCB0b28gbWFueSByZXF1ZXN0cyBpbiBhIGdpdmVuIGFtb3VudCBvZiB0aW1lIChcInJhdGUgbGltaXRpbmdcIikuXHJcbiAgICovXHJcbiAgVE9PX01BTllfUkVRVUVTVFMgPSA0MjksXHJcbiAgLyoqXHJcbiAgICogT2ZmaWNpYWwgRG9jdW1lbnRhdGlvbiBAIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM2NTg1I3NlY3Rpb24tNVxyXG4gICAqXHJcbiAgICogVGhlIHNlcnZlciBpcyB1bndpbGxpbmcgdG8gcHJvY2VzcyB0aGUgcmVxdWVzdCBiZWNhdXNlIGl0cyBoZWFkZXIgZmllbGRzIGFyZSB0b28gbGFyZ2UuIFRoZSByZXF1ZXN0IE1BWSBiZSByZXN1Ym1pdHRlZCBhZnRlciByZWR1Y2luZyB0aGUgc2l6ZSBvZiB0aGUgcmVxdWVzdCBoZWFkZXIgZmllbGRzLlxyXG4gICAqL1xyXG4gIFJFUVVFU1RfSEVBREVSX0ZJRUxEU19UT09fTEFSR0UgPSA0MzEsXHJcbiAgLyoqXHJcbiAgICogT2ZmaWNpYWwgRG9jdW1lbnRhdGlvbiBAIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM3NzI1XHJcbiAgICpcclxuICAgKiBUaGUgdXNlci1hZ2VudCByZXF1ZXN0ZWQgYSByZXNvdXJjZSB0aGF0IGNhbm5vdCBsZWdhbGx5IGJlIHByb3ZpZGVkLCBzdWNoIGFzIGEgd2ViIHBhZ2UgY2Vuc29yZWQgYnkgYSBnb3Zlcm5tZW50LlxyXG4gICAqL1xyXG4gIFVOQVZBSUxBQkxFX0ZPUl9MRUdBTF9SRUFTT05TID0gNDUxLFxyXG4gIC8qKlxyXG4gICAqIE9mZmljaWFsIERvY3VtZW50YXRpb24gQCBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzIzMSNzZWN0aW9uLTYuNi4xXHJcbiAgICpcclxuICAgKiBUaGUgc2VydmVyIGVuY291bnRlcmVkIGFuIHVuZXhwZWN0ZWQgY29uZGl0aW9uIHRoYXQgcHJldmVudGVkIGl0IGZyb20gZnVsZmlsbGluZyB0aGUgcmVxdWVzdC5cclxuICAgKi9cclxuICBJTlRFUk5BTF9TRVJWRVJfRVJST1IgPSA1MDAsXHJcbiAgLyoqXHJcbiAgICogT2ZmaWNpYWwgRG9jdW1lbnRhdGlvbiBAIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM3MjMxI3NlY3Rpb24tNi42LjJcclxuICAgKlxyXG4gICAqIFRoZSByZXF1ZXN0IG1ldGhvZCBpcyBub3Qgc3VwcG9ydGVkIGJ5IHRoZSBzZXJ2ZXIgYW5kIGNhbm5vdCBiZSBoYW5kbGVkLiBUaGUgb25seSBtZXRob2RzIHRoYXQgc2VydmVycyBhcmUgcmVxdWlyZWQgdG8gc3VwcG9ydCAoYW5kIHRoZXJlZm9yZSB0aGF0IG11c3Qgbm90IHJldHVybiB0aGlzIGNvZGUpIGFyZSBHRVQgYW5kIEhFQUQuXHJcbiAgICovXHJcbiAgTk9UX0lNUExFTUVOVEVEID0gNTAxLFxyXG4gIC8qKlxyXG4gICAqIE9mZmljaWFsIERvY3VtZW50YXRpb24gQCBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzIzMSNzZWN0aW9uLTYuNi4zXHJcbiAgICpcclxuICAgKiBUaGlzIGVycm9yIHJlc3BvbnNlIG1lYW5zIHRoYXQgdGhlIHNlcnZlciwgd2hpbGUgd29ya2luZyBhcyBhIGdhdGV3YXkgdG8gZ2V0IGEgcmVzcG9uc2UgbmVlZGVkIHRvIGhhbmRsZSB0aGUgcmVxdWVzdCwgZ290IGFuIGludmFsaWQgcmVzcG9uc2UuXHJcbiAgICovXHJcbiAgQkFEX0dBVEVXQVkgPSA1MDIsXHJcbiAgLyoqXHJcbiAgICogT2ZmaWNpYWwgRG9jdW1lbnRhdGlvbiBAIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM3MjMxI3NlY3Rpb24tNi42LjRcclxuICAgKlxyXG4gICAqIFRoZSBzZXJ2ZXIgaXMgbm90IHJlYWR5IHRvIGhhbmRsZSB0aGUgcmVxdWVzdC4gQmFzZSBjYXVzZXMgYXJlIGEgc2VydmVyIHRoYXQgaXMgZG93biBmb3IgbWFpbnRlbmFuY2Ugb3IgdGhhdCBpcyBvdmVybG9hZGVkLiBOb3RlIHRoYXQgdG9nZXRoZXIgd2l0aCB0aGlzIHJlc3BvbnNlLCBhIHVzZXItZnJpZW5kbHkgcGFnZSBleHBsYWluaW5nIHRoZSBwcm9ibGVtIHNob3VsZCBiZSBzZW50LiBUaGlzIHJlc3BvbnNlcyBzaG91bGQgYmUgdXNlZCBmb3IgdGVtcG9yYXJ5IGNvbmRpdGlvbnMgYW5kIHRoZSBSZXRyeS1BZnRlcjogSFRUUCBoZWFkZXIgc2hvdWxkLCBpZiBwb3NzaWJsZSwgY29udGFpbiB0aGUgZXN0aW1hdGVkIHRpbWUgYmVmb3JlIHRoZSByZWNvdmVyeSBvZiB0aGUgc2VydmljZS4gVGhlIHdlYm1hc3RlciBtdXN0IGFsc28gdGFrZSBjYXJlIGFib3V0IHRoZSBjYWNoaW5nLXJlbGF0ZWQgaGVhZGVycyB0aGF0IGFyZSBzZW50IGFsb25nIHdpdGggdGhpcyByZXNwb25zZSwgYXMgdGhlc2UgdGVtcG9yYXJ5IGNvbmRpdGlvbiByZXNwb25zZXMgc2hvdWxkIHVzdWFsbHkgbm90IGJlIGNhY2hlZC5cclxuICAgKi9cclxuICBTRVJWSUNFX1VOQVZBSUxBQkxFID0gNTAzLFxyXG4gIC8qKlxyXG4gICAqIE9mZmljaWFsIERvY3VtZW50YXRpb24gQCBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzIzMSNzZWN0aW9uLTYuNi41XHJcbiAgICpcclxuICAgKiBUaGlzIGVycm9yIHJlc3BvbnNlIGlzIGdpdmVuIHdoZW4gdGhlIHNlcnZlciBpcyBhY3RpbmcgYXMgYSBnYXRld2F5IGFuZCBjYW5ub3QgZ2V0IGEgcmVzcG9uc2UgaW4gdGltZS5cclxuICAgKi9cclxuICBHQVRFV0FZX1RJTUVPVVQgPSA1MDQsXHJcbiAgLyoqXHJcbiAgICogT2ZmaWNpYWwgRG9jdW1lbnRhdGlvbiBAIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM3MjMxI3NlY3Rpb24tNi42LjZcclxuICAgKlxyXG4gICAqIFRoZSBIVFRQIHZlcnNpb24gdXNlZCBpbiB0aGUgcmVxdWVzdCBpcyBub3Qgc3VwcG9ydGVkIGJ5IHRoZSBzZXJ2ZXIuXHJcbiAgICovXHJcbiAgSFRUUF9WRVJTSU9OX05PVF9TVVBQT1JURUQgPSA1MDUsXHJcbiAgLyoqXHJcbiAgICogT2ZmaWNpYWwgRG9jdW1lbnRhdGlvbiBAIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMyNTE4I3NlY3Rpb24tMTAuNlxyXG4gICAqXHJcbiAgICogVGhlIHNlcnZlciBoYXMgYW4gaW50ZXJuYWwgY29uZmlndXJhdGlvbiBlcnJvcjogdGhlIGNob3NlbiB2YXJpYW50IHJlc291cmNlIGlzIGNvbmZpZ3VyZWQgdG8gZW5nYWdlIGluIHRyYW5zcGFyZW50IGNvbnRlbnQgbmVnb3RpYXRpb24gaXRzZWxmLCBhbmQgaXMgdGhlcmVmb3JlIG5vdCBhIHByb3BlciBlbmQgcG9pbnQgaW4gdGhlIG5lZ290aWF0aW9uIHByb2Nlc3MuXHJcbiAgICovXHJcbiAgSU5TVUZGSUNJRU5UX1NUT1JBR0UgPSA1MDcsXHJcbiAgLyoqXHJcbiAgICogT2ZmaWNpYWwgRG9jdW1lbnRhdGlvbiBAIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM2NTg1I3NlY3Rpb24tNlxyXG4gICAqXHJcbiAgICogVGhlIDUxMSBzdGF0dXMgY29kZSBpbmRpY2F0ZXMgdGhhdCB0aGUgY2xpZW50IG5lZWRzIHRvIGF1dGhlbnRpY2F0ZSB0byBnYWluIG5ldHdvcmsgYWNjZXNzLlxyXG4gICAqL1xyXG4gIE5FVFdPUktfQVVUSEVOVElDQVRJT05fUkVRVUlSRUQgPSA1MTFcclxufSJdfQ==