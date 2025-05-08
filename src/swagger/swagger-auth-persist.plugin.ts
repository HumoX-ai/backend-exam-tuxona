// export const SwaggerAuthPersistPlugin = {
//   wrapComponents: {
//     // Wrap the AuthorizeBtn component to persist token
//     AuthorizeBtn: (Original, system) => (props) => {
//       const handleAuthorize = () => {
//         const auth = system.getState().toJS().auth;
//         const bearerAuth = auth.authorized && auth.authorized['BearerAuth'];
//         if (bearerAuth && bearerAuth.value) {
//           localStorage.setItem('swagger_bearer_token', bearerAuth.value);
//         }
//       };

//       return <Original {...props} onClick={handleAuthorize} />;
//     },
//     // Wrap the authorize form to prefill token
//     authorize: (Original, system) => (props) => {
//       const token = localStorage.getItem('swagger_bearer_token');
//       if (token && !system.getState().toJS().auth.authorized['BearerAuth']) {
//         system.authActions.authorize({
//           BearerAuth: {
//             name: 'BearerAuth',
//             schema: { type: 'http', scheme: 'bearer' },
//             value: token,
//           },
//         });
//       }
//       return <Original {...props} />;
//     },
//   },
// };
