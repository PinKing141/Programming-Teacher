# C++ Resit Pass Cram Sheet

## Goal
You do not need to know all of C++. You need enough repeated exam patterns to get 40%.

## Highest-Yield Topics
1. Functions with the correct return type.
2. `if`, `else if`, and `else` returning values.
3. `for` loops over `vector<int>`.
4. Fixed array checks like `arr[0]`, `arr[1]`, `arr[2]`.
5. Basic classes with public attributes, constructor, getter, setter.
6. Simple inheritance with `: Parent(args)`.
7. String reverse and biggest/smallest word patterns.

## The Six Patterns To Memorise
### 1. Arithmetic return function
```cpp
int Convert(float temp)
{
    return (temp * 3.14f) + 5;
}
```

### 2. If / else return function
```cpp
int Update_Points(int points)
{
    if(points > 0)
    {
        return (points * 4) + 10;
    }
    else
    {
        return 0;
    }
}
```

### 3. Loop over vector with even and odd indexes
```cpp
int Total_Sand_Diff(vector<int> amounts)
{
    int even = 0;
    int odd = 0;

    for(int i = 0; i < amounts.size(); i++)
    {
        if(i % 2 == 0)
        {
            even = even + amounts[i];
        }
        else
        {
            odd = odd + amounts[i];
        }
    }

    return even - odd;
}
```

### 4. Compare two objects
```cpp
string BestPressure(Wheel& a, Wheel& b)
{
    if(a.pressure > b.pressure)
    {
        return a.name;
    }
    else if(b.pressure > a.pressure)
    {
        return b.name;
    }
    else
    {
        return "both";
    }
}
```

### 5. Basic class
```cpp
class Ship
{
public:
    bool isStationed;
    string owner;
    static int numberShips;

    Ship(bool stationed, string newOwner)
    {
        isStationed = stationed;
        owner = newOwner;
        numberShips++;
    }

    string GetOwner()
    {
        return owner;
    }

    void SetOwner(string newOwner)
    {
        owner = newOwner;
    }
};

int Ship::numberShips = 0;
```

### 6. Child class
```cpp
class EvilAccount : public BankAccount
{
public:
    int evilLevel = 0;

    EvilAccount(float balance, string name) : BankAccount(balance, name)
    {
    }

    void SetEvilLevel(int level)
    {
        evilLevel = level;
    }

    int GetEvilLevel()
    {
        return evilLevel;
    }
};
```

## 10-Second Check Before Submit
1. Am I returning the value instead of printing it?
2. Does the return type exactly match the question?
3. Did I keep the exact parameter types and names?
4. Are all semicolons there?
5. Are all braces balanced?
6. If it is a loop, did I use `i < values.size()`?
7. If it is an array, did I use `arr[0]`, `arr[1]`, `arr[2]`?
8. If it is a class, are members `public` if required?
9. If it is `static`, did I define it outside the class too?
10. Did I avoid `auto` and extra libraries?

## Best Route To 40%
1. Secure the function questions first.
2. Secure vector or array logic next.
3. Secure one basic class pattern.
4. Then attempt inheritance or string-building if time remains.

## Final Exam Rule
If you are stuck, write the closest correct template you know and adapt names and types carefully. Partial credit matters.