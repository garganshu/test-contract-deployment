//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Faucet {

  address payable public owner ; 

  constructor() payable  {
    owner = payable(msg.sender); 
  }
  
  function withdraw(uint _amount) public {
    require(_amount <= .1 ether);
    (bool sent, ) = payable(msg.sender).call{ value: _amount }(" ");
    require(sent, "withdaw fund failed");
  }

  function withdrawAll() onlyOwner public {
    (bool sent, ) = payable(msg.sender).call { value: address(this).balance }("");
    require(sent, "withdraw all fund failed");
  }

  function destroyFaucet() onlyOwner public {
    selfdestruct(owner);
  }

  modifier onlyOwner {
    require(msg.sender == owner, "Not the owner");
    _;
  }

  receive() external payable {}
}