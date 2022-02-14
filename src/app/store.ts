import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer, {incrementByAmount} from '../features/counter/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// window.addEventListener('message', event => {
//     console.log(event);
//     console.log(event.data);
//     // IMPORTANT: check the origin of the data!
//     if (event.origin.startsWith('http://127.0.0.1:3001')) {
//     // if (event.origin.startsWith('http://your-first-site.com')) {
//         // The data was sent from your site.
//         // Data sent with postMessage is stored in event.data:
//         console.log(store);
//         store.dispatch(incrementByAmount(event.data))
//     } else {
//         // The data was NOT sent from your site!
//         // Be careful! Do not use it. This else branch is
//         // here just for clarity, you usually shouldn't need it.
//         return;
//     }
// });
