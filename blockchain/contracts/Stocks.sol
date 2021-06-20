// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Stocks {
    /// quote structure
    struct stock {
        uint256 price;
        uint256 volume;
    }
    /// quotes by symbol
    mapping(bytes4 => stock) stockQuote;
    /// Contract owner
    address oracleOwner;

    modifier onlyOwner() {
        require(oracleOwner == msg.sender);
        _;
    }

    constructor() {
        oracleOwner = msg.sender;
    }

    /// Set the value of a stock
    function setStock(
        bytes4 symbol,
        uint256 price,
        uint256 volume
    ) public onlyOwner {
        stockQuote[symbol] = stock({price: price, volume: volume});
    }

    /// Get the value of a stock
    function getStockPrice(bytes4 symbol)
        public
        view
        onlyOwner
        returns (uint256)
    {
        return stockQuote[symbol].price;
    }

    /// Get the value of volume traded for a stock
    function getStockVolume(bytes4 symbol)
        public
        view
        onlyOwner
        returns (uint256)
    {
        return stockQuote[symbol].volume;
    }
}
