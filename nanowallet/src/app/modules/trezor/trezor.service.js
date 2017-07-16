/** Service storing Trezor utility functions. */
class Trezor {

    /**
     * Initialize dependencies and properties
     *
     * @params {services} - Angular services to inject
     */
    constructor() {
        'ngInject';

        // Service dependencies region //

        // End dependencies region //

        // Service properties region //

        // End properties region //
    }

    // Service methods region //

    createWallet(network) {
        return this.createAccount(network, 0, "Primary").then((account) => ({
            "name": "TREZOR",
            "accounts": {
                "0": account
            }
        }));
    }

    bip44(network, index) {
        const coinType = network == -104 ? 1 : 43;

        return `m/44'/${coinType}'/${index}'/0'/0'`;
    }

    createAccount(network, index, label) {
        return new Promise((resolve, reject) => {
            const hdKeypath = this.bip44(network, index);

            TrezorConnect.nemGetAddress(hdKeypath, network, false, (result) => {
                if (result.success) {
                    resolve({
                        "brain": false,
                        "algo": "trezor",
                        "encrypted": "",
                        "iv": "",
                        "address": result.address,
                        "label": label,
                        "network": network,
                        "child": "",
                        "hdKeypath": hdKeypath
                    });
                } else {
                    reject(result.error);
                }
            });
        });
    }

    serialize(transaction, account) {
        return new Promise((resolve, reject) => {
            TrezorConnect.nemSignTx(account.hdKeypath, transaction, (result) => {
                if (result.success) {
                    resolve(result.message);
                } else {
                    reject({
                        "code": 0,
                        "data": {
                            "message": result.error
                        }
                    });
                }
            });
        });
    }

    // End methods region //

}

export default Trezor;
