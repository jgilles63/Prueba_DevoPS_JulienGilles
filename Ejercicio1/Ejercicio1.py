# -*- coding: utf-8 -*-
"""
Created on Sat Apr 17 11:08:27 2021

@author: Julien GILLES
"""


def kind_of_numbers(list_of_numbers):
    """
    Check every number of a list and return a list of tuple which clasify each number type.
    (Perfecto, Abundante, Defectivo)
    
    param: list_of_numbers: list of integer.

    return: list of tuple [(number, Type of number),...]
    """
    # Check input type (list of integer)
    try:
        if type(list_of_numbers) != list:
            raise Exception("Input function is not a List")
        _isListOfInteger = [value for value in list_of_numbers if isinstance(value, int) and value >= 0]
        if len(_isListOfInteger) != len(list_of_numbers):
            raise Exception("Input function is not a List of positive integer")
    except Exception as e:
        print(e)
        return
    
    # Define the return value
    # initialize List of tuple (can duplicate values)
    _listKindOfNumbers = list()
    # In order to complete _listKindOfNumbers we verify each value of list_of_numbers
    for value in list_of_numbers:
        # In order to know the kind of a value we need to get the sum of all this divisors
        _halfValue = value/2
        if _halfValue.is_integer():
            _rangeValue = int(value/2)
        else:
            _rangeValue = int(round(value/3))
        # In order to optimize, variable rangeValue has been defined 
        # Because we know that the first divisor of a number is 
        # the number/2 or number/3 depending on number is par or unpar
        # initialize a variable that will contain all divisors of a number
        _listOfDivisors = list()
        # Loop to get all divisor of number
        for i in range(_rangeValue+1):
            if i == 0:
                continue
            elif value%i == 0:
                _listOfDivisors.append(i)
        _sumOfDivisors = sum(_listOfDivisors)
        # Check kind of number
        if _sumOfDivisors == value:
            _listKindOfNumbers.append("Perfecto")
        elif _sumOfDivisors > value:
            _listKindOfNumbers.append("Abundante")
        else:
            _listKindOfNumbers.append("Defectivo")
                
    _tupleListToReturn = list(zip(list_of_numbers, _listKindOfNumbers))
    print(_tupleListToReturn)
    return _tupleListToReturn


if __name__ == "__main__":
    kind_of_numbers(6)
    kind_of_numbers([12,1])
    kind_of_numbers([2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])
    kind_of_numbers([6,"2"])
    kind_of_numbers([6,1.2])
    kind_of_numbers([1])
    kind_of_numbers([0])
    kind_of_numbers([-1])
    kind_of_numbers([6,7,8,9,5,4,3,2,1,-5,16,17,18,19])