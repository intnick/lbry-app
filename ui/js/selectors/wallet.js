import { createSelector } from 'reselect'
import {
  selectCurrentPage,
} from 'selectors/app'

export const _selectState = state => state.wallet || {}

export const selectBalance = createSelector(
  _selectState,
  (state) => {
    return state.balance || 0
  }
)

export const selectTransactions = createSelector(
  _selectState,
  (state) => state.transactions
)

export const selectTransactionItems = createSelector(
  selectTransactions,
  (transactions) => {
    if (transactions.length == 0) return transactions

    const transactionItems = []
    const condensedTransactions = {}

    transactions.forEach(function(tx) {
      const txid = tx["txid"];
      if (!(txid in condensedTransactions)) {
        condensedTransactions[txid] = 0;
      }
      condensedTransactions[txid] += parseFloat(tx["value"]);
    });
    transactions.reverse().forEach(function(tx) {
      const txid = tx["txid"];
      if (condensedTransactions[txid] && condensedTransactions[txid] != 0)
      {
        transactionItems.push({
          id: txid,
          date: tx["timestamp"] ? (new Date(parseInt(tx["timestamp"]) * 1000)) : null,
          amount: condensedTransactions[txid]
        });
        delete condensedTransactions[txid];
      }
    });

    return transactionItems
  }
)

export const selectIsFetchingTransactions = createSelector(
  _selectState,
  (state) => state.fetchingTransactions
)

export const shouldFetchTransactions = createSelector(
  selectCurrentPage,
  selectTransactions,
  selectIsFetchingTransactions,
  (page, transactions, fetching) => {
    if (page != 'wallet') return false
    if (fetching) return false
    if (transactions.length != 0) return false

    return true
  }
)

export const selectReceiveAddress = createSelector(
  _selectState,
  (state) => state.receiveAddress
)

export const selectGettingNewAddress = createSelector(
  _selectState,
  (state) => state.gettingNewAddress
)

export const selectDaemonReady = createSelector(
  () => sessionStorage.getItem('loaded') == 'y'
)

export const shouldGetReceiveAddress = createSelector(
  selectReceiveAddress,
  selectGettingNewAddress,
  selectDaemonReady,
  (address, fetching, daemonReady) => {
    if (!daemonReady) return false
    if (fetching) return false
    if (address !== undefined) return false

    return true
  }
)

export const shouldCheckAddressIsMine = createSelector(
  _selectState,
  selectCurrentPage,
  selectReceiveAddress,
  selectDaemonReady,
  (state, page, address, daemonReady) => {
    if (!daemonReady) return false
    if (address === undefined) return false
    if (state.addressOwnershipChecked) return false

    return true
  }
)