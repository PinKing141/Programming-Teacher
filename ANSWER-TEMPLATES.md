# Answer Templates

## Convert
```cpp
int Convert(float temp)
{
    return (temp * 3.14f) + 5;
}
```

## Update_Points
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

## SafeToFly
```cpp
bool SafeToFly(int arr[])
{
    if(arr[0] < 10)
    {
        return false;
    }

    if(arr[1] > 5 && arr[2] <= 50)
    {
        return false;
    }

    return true;
}
```

## Total_Sand_Diff
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

## BestPressure
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

## Ship
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

## Channel
```cpp
class Channel
{
public:
    string title;
    float channelNum;

    Channel(string t, float c)
    {
        title = t;
        channelNum = c;
    }

    void SetTitle(string t)
    {
        title = t;
    }

    string GetTitle()
    {
        return title;
    }

    string Direction(float current)
    {
        if(current < channelNum)
        {
            return "go up!";
        }
        else if(current > channelNum)
        {
            return "go down!";
        }
        else
        {
            return "stay!";
        }
    }
};
```

## EvilAccount
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

## Password_maker
```cpp
string Password_maker(vector<string> keywords)
{
    string biggest = keywords[0];
    int bigIndex = 0;
    string smallest = keywords[0];

    for(int i = 0; i < keywords.size(); i++)
    {
        if(keywords[i].length() >= biggest.length())
        {
            biggest = keywords[i];
            bigIndex = i;
        }

        if(keywords[i].length() <= smallest.length())
        {
            smallest = keywords[i];
        }
    }

    string reversed = "";
    for(int i = smallest.length() - 1; i >= 0; i--)
    {
        reversed = reversed + smallest[i];
    }

    return biggest + reversed + std::to_string(bigIndex % 2);
}
```

## Generic Getter and Setter
```cpp
string GetTitle()
{
    return title;
}

void SetTitle(string t)
{
    title = t;
}
```

## Generic Parent Constructor Call
```cpp
Child(float a, string b) : Parent(a, b)
{
}
```