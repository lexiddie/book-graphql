import { InMemoryCache } from '@apollo/client';

export const cache: InMemoryCache = new InMemoryCache({});

// export const cache: InMemoryCache = new InMemoryCache({
//   typePolicies: {
//     Query: {
//       fields: {
//         currentUser: {
//           read() {
//             return currentUserVar();
//           }
//         },
//         isSignIn: {
//           read() {
//             return isSignInVar();
//           }
//         }
//       }
//     }
//   }
// });

// /**
//  * Set initial values when we create cache variables.
//  */

// export const currentUserVar = makeVar<CurrentUser | null>(null);
// export const isSignInVar = makeVar<boolean>(false);
