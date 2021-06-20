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

    constructor() {
        oracleOwner = msg.sender;
    }

    /// Set the value of a stock
    function setStock(
        bytes4 symbol,
        uint256 price,
        uint256 volume
    ) public {}

    /// Get the value of a stock
    function getStockPrice(bytes4 symbol) public view returns (uint256) {}

    /// Get the value of volume traded for a stock
    function getStockVolume(bytes4 symbol) public view returns (uint256) {}
}
