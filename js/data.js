// ═══════════════════════════════════════════════
// DATA — ALL CONTENT (Beautifully Formatted C++)
// ═══════════════════════════════════════════════
const DAYS = [
  {
    title: "Day 1 — Functions & If Statements",
    lessons: [
      {
        h: "Variables — the 4 types you need",
        p: "A variable is a named box that stores a value. Every variable needs a TYPE and a NAME. Your exam only uses these 4 types — nothing else.",
        code: `int    age   = 20;       // whole numbers: 0, 5, -3, 100
float  price = 4.99;     // decimal numbers: 1.5, -0.5, 99.9
bool   open  = true;     // only two values: true or false
string name  = "Dave";   // text inside double quotes`,
        tip: "That is all 4 types. Your exam does not use pointers, arrays, or anything else."
      },
      {
        h: "Functions — write these for every question",
        p: "Every single question asks you to write or complete a function. A function has 4 parts: return type, name, parameters, and a return statement.",
        code: `int MultiplyByFour(int x)
{
    return x * 4;
}

// int             → what type it gives back
// MultiplyByFour  → the name of the function
// int x           → the input it receives
// return x * 4    → the answer it sends back`,
        warn: "EXAM RULE: Always use `return`. NEVER use `cout` in your answer functions."
      },
      {
        h: "If / Else statements",
        p: "An if statement runs code only when a condition is true. This pattern appears in almost every question. The comparison operators are: `>` `<` `>=` `<=` `==` `!=`",
        code: `int Update_Points(int points)
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
// This IS S1-Q1 from your actual exam.
// Notice that 'return' must appear in BOTH branches.`,
        tip: "`return` must exist in both the `if` AND the `else`. The function must always give back a value."
      },
      {
        h: "else if — for middle conditions",
        p: "When you have more than two cases, use `else if` in the middle. Always check the highest or most specific threshold first.",
        code: `int ScoreGrade(int score)
{
    if(score >= 70)
    {
        return 1;   // highest grade
    }
    else if(score >= 40)
    {
        return 2;   // middle grade
    }
    else
    {
        return 3;   // lowest grade
    }
}`
      }
    ],
    questions: [
      {
        type: "mcq", diff: "easy",
        q: "Which symbol checks if two values are EQUAL in C++?",
        opts: ["`=`", "`==`", "`===`", "`eq`"],
        ans: 1,
        explain: "`==` checks equality. `=` assigns a value. These are completely different. Never mix them up."
      },
      {
        type: "mcq", diff: "easy",
        q: "What is wrong with this?\n`void Triple(int x) { cout << x * 3; }`",
        opts: ["Nothing", "Should use `return` not `cout`", "Wrong parameter type", "Missing semicolon"],
        ans: 1,
        explain: "The exam always says: return the value, do not print it. Change `cout << x * 3;` to `return x * 3;`."
      },
      {
        type: "mcq", diff: "easy",
        q: "What return type do you use when a function returns nothing?",
        opts: ["`int`", "`null`", "`void`", "empty"],
        ans: 2,
        explain: "`void` means the function returns nothing at all. Setters always use `void`."
      },
      {
        type: "mcq", diff: "medium",
        q: "What does this return when `x = -5`?\n`if(x > 0) { return x * 4 + 10; } else { return 0; }`",
        opts: ["`0`", "`-10`", "`-20`", "Error"],
        ans: 0,
        explain: "`-5` is not `> 0`, so the `else` branch runs and returns `0`."
      },
      {
        type: "code", diff: "easy",
        q: "Write a function called `AddFive`.\nIt takes one `int` called `n`.\nIt returns `n + 5`.",
        hint: `int AddFive(int n)
{
    // return n plus 5
}`,
        ans: `int AddFive(int n)
{
    return n + 5;
}`,
        checks: ["AddFive", "int", "return", "n + 5", "n+5"]
      },
      {
        type: "code", diff: "easy",
        q: "Write a function called `Triple`.\nIt takes one `int` called `x`.\nIt returns `x` multiplied by 3.",
        hint: `int Triple(int x)
{
    // return x multiplied by 3
}`,
        ans: `int Triple(int x)
{
    return x * 3;
}`,
        checks: ["Triple", "int", "return", "x * 3", "x*3"]
      },
      {
        type: "code", diff: "medium",
        q: "Write a function called `IsPositive`.\nTakes `int num`. Returns `bool`.\nReturn `true` if `num > 0`, `false` otherwise.",
        hint: `bool IsPositive(int num)
{
    if(num > 0)
    {
        return true;
    }
    else
    {
        // what goes here?
    }
}`,
        ans: `bool IsPositive(int num)
{
    if(num > 0)
    {
        return true;
    }
    else
    {
        return false;
    }
}`,
        checks: ["IsPositive", "bool", "return true", "return false", "num > 0"]
      },
      {
        type: "code", diff: "medium",
        q: "Write `BiggerNumber`.\nTakes two `int`s: `a` and `b`.\nReturn whichever is bigger. If equal return `a`.",
        hint: `int BiggerNumber(int a, int b)
{
    if(a >= b)
    {
        return a;
    }
    else
    {
        // return the other one
    }
}`,
        ans: `int BiggerNumber(int a, int b)
{
    if(a >= b)
    {
        return a;
    }
    else
    {
        return b;
    }
}`,
        checks: ["BiggerNumber", "a >= b", "return a", "return b"]
      },
      {
        type: "code", diff: "hard",
        q: "EXAM STYLE — S1-Q1:\nWrite `Update_Points`.\nTakes `int points`.\nIf positive: return `(points * 4) + 10`.\nIf negative or zero: return `0`.\n\nTest: `points=10` → `50`.  Test: `points=-5` → `0`.",
        hint: `int Update_Points(int points)
{
    if(points > 0)
    {
        return (points * 4) + 10;
    }
    else
    {
        return 0;
    }
}`,
        ans: `int Update_Points(int points)
{
    if(points > 0)
    {
        return (points * 4) + 10;
    }
    else
    {
        return 0;
    }
}`,
        checks: ["Update_Points", "points > 0", "* 4", "+ 10", "return 0"]
      },
      {
        type: "code", diff: "hard",
        q: "Write `ScoreGrade`.\nTakes `int score`.\nIf `score >= 70`: return `1`.\nIf `score >= 40` (but `< 70`): return `2`.\nOtherwise return `3`.\n(Use `else if` for the middle case.)",
        hint: `int ScoreGrade(int score)
{
    if(score >= 70)
    {
        return 1;
    }
    else if(score >= 40)
    {
        // middle case
    }
    else
    {
        // lowest case
    }
}`,
        ans: `int ScoreGrade(int score)
{
    if(score >= 70)
    {
        return 1;
    }
    else if(score >= 40)
    {
        return 2;
    }
    else
    {
        return 3;
    }
}`,
        checks: ["ScoreGrade", "score >= 70", "return 1", "else if", "score >= 40", "return 2", "return 3"]
      }
    ]
  },
  {
    title: "Day 2 — Loops & Vectors",
    lessons: [
      {
        h: "For loops — the most used pattern",
        p: "A for loop repeats a block of code a set number of times. It has three parts inside the brackets: start, condition, and step.",
        code: `for(int i = 0; i < 5; i++)
{
    // runs 5 times. i goes: 0, 1, 2, 3, 4
}

// int i = 0  →  start i at 0
// i < 5      →  keep going while i is less than 5
// i++        →  add 1 to i each time (same as i = i + 1)`,
        tip: "`i++` is shorthand for `i = i + 1`. You will write this in every loop."
      },
      {
        h: "Vectors — lists of values",
        p: "A vector is a list. You access items using square brackets with an index number. Indexes always start at 0, not 1.",
        code: `vector<int> amounts = {10, 25, 5, 10};

amounts[0] = 10;  // first item  (index 0)
amounts[1] = 25;  // second item (index 1)
amounts[2] = 5;   // third item  (index 2)
amounts[3] = 10;  // fourth item (index 3)

amounts.size();   // gives 4 (how many items are in it)`,
        warn: "Indexes start at 0. A 4-item vector has indexes `0`, `1`, `2`, `3`. There is no index `4`."
      },
      {
        h: "Looping through a vector",
        p: "Combine loops and vectors. Use `amounts.size()` as the loop limit so it works for any length vector. Use `i % 2` to check even or odd indexes.",
        code: `int even = 0;
int odd = 0;

for(int i = 0; i < amounts.size(); i++)
{
    if(i % 2 == 0)       // even index: 0, 2, 4...
    {
        even = even + amounts[i];
    }
    else                 // odd index: 1, 3, 5...
    {
        odd = odd + amounts[i];
    }
}
// 4 % 2 = 0 (even)  |  5 % 2 = 1 (odd)`,
        tip: "This pattern is exactly what S1-Q2 (`Total_Sand_Diff`) tests. Learn it by heart."
      },
      {
        h: "Running totals — keeping a counter",
        p: "To sum up values in a loop, create a counter BEFORE the loop, then add to it inside.",
        code: `int total = 0;    // always start at 0, BEFORE the loop

for(int i = 0; i < numbers.size(); i++)
{
    total = total + numbers[i];   // add each item
}

return total;     // return AFTER the loop`
      }
    ],
    questions: [
      {
        type: "mcq", diff: "easy",
        q: "A vector has 6 items. What is the index of the LAST item?",
        opts: ["`6`", "`5`", "`0`", "`size()`"],
        ans: 1,
        explain: "Indexes start at 0. 6 items = indexes `0`, `1`, `2`, `3`, `4`, `5`. Last = `5` (which is `size()-1`)."
      },
      {
        type: "mcq", diff: "easy",
        q: "What does `i % 2 == 0` tell you?",
        opts: ["`i` is negative", "`i` is even", "`i` is odd", "`i` equals 2"],
        ans: 1,
        explain: "`%` gives the remainder after division. Even numbers divided by 2 have a remainder of 0."
      },
      {
        type: "code", diff: "easy",
        q: "Write `SumAll`.\nTakes `vector<int> numbers`.\nReturn the sum of ALL numbers.",
        hint: `int SumAll(vector<int> numbers)
{
    int total = 0;
    for(int i = 0; i < numbers.size(); i++)
    {
        total = total + numbers[i];
    }
    return total;
}`,
        ans: `int SumAll(vector<int> numbers)
{
    int total = 0;
    
    for(int i = 0; i < numbers.size(); i++)
    {
        total = total + numbers[i];
    }
    
    return total;
}`,
        checks: ["SumAll", "int total", "= 0", "numbers.size()", "total + numbers[i]", "return total"]
      },
      {
        type: "code", diff: "medium",
        q: "Write `FindLargest`.\nTakes `vector<int> numbers`.\nReturn the biggest number in the vector.\nTest: `{3, 9, 2, 7}` → `9`",
        hint: `int FindLargest(vector<int> numbers)
{
    int largest = numbers[0]; // Start with first item
    
    for(int i = 0; i < numbers.size(); i++)
    {
        if(numbers[i] > largest)
        {
            largest = numbers[i];
        }
    }
    
    return largest;
}`,
        ans: `int FindLargest(vector<int> numbers)
{
    int largest = numbers[0];
    
    for(int i = 0; i < numbers.size(); i++)
    {
        if(numbers[i] > largest)
        {
            largest = numbers[i];
        }
    }
    
    return largest;
}`,
        checks: ["FindLargest", "largest = numbers[0]", "numbers[i] > largest", "largest = numbers[i]", "return largest"]
      },
      {
        type: "code", diff: "hard",
        q: "EXAM STYLE — S1-Q2:\nWrite `Total_Sand_Diff`.\nTakes `vector<int> amounts`.\nReturn (sum of even indexes) - (sum of odd indexes).\n\nTest: `{10, 25, 5, 10}` → even=`15`, odd=`35`, return `-20`",
        hint: `int Total_Sand_Diff(vector<int> amounts)
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
}`,
        ans: `int Total_Sand_Diff(vector<int> amounts)
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
}`,
        checks: ["Total_Sand_Diff", "int even", "int odd", "amounts.size()", "i % 2 == 0", "even + amounts[i]", "odd + amounts[i]", "return even - odd"]
      }
    ]
  },
  {
    title: "Day 3 — Strings",
    lessons: [
      {
        h: "String basics",
        p: "A string is text. You can access each character using square brackets, exactly like a vector. Characters use single quotes, full strings use double quotes.",
        code: `string word = "Hello";

word[0] = 'H';    // index 0 (first character)
word[1] = 'e';    // index 1
word[4] = 'o';    // index 4 (last character)

word.length();    // gives 5 (number of characters)`,
        tip: "Characters use single quotes `'H'`. Full strings use double quotes `\"Hello\"`. This distinction matters."
      },
      {
        h: "Reversing a string",
        p: "Loop BACKWARDS through the string — start at the last index and go down to 0. Use `i--` instead of `i++`.",
        code: `string word = "Pear";
string reversed = "";    // start empty

for(int i = word.length() - 1; i >= 0; i--)
{
    reversed = reversed + word[i];
}
// result: "reaP"

// word.length()-1 = last index (3 for "Pear")
// i--  subtracts 1 each time (goes backwards)
// i >= 0  stops after index 0 is processed`,
        warn: "For the backwards loop: start = `length-1`, condition = `i>=0`, step = `i--`. All three differ from a normal loop."
      },
      {
        h: "Finding the longest and shortest word",
        p: "Loop through a vector of strings, compare lengths. Use `>=` (not `>`) to take the latest word when lengths are tied — the exam requires this.",
        code: `string biggest = "";
int bigIndex = 0;

for(int i = 0; i < words.size(); i++)
{
    if(words[i].length() >= biggest.length())  // >= ensures latest wins
    {
        biggest = words[i];
        bigIndex = i;
    }
}

// For SMALLEST: use <= and start smallest = words[0]`,
        tip: "Use `>=` for biggest (latest wins). Use `<=` for smallest (latest wins). Start smallest at `words[0]`, not empty string."
      },
      {
        h: "std::to_string — converting int to string",
        p: "When you need to attach a number to a string, you must convert it first with `std::to_string`.",
        code: `int num = 7;
string result = std::to_string(num);    // result = "7"

// Joining strings:
string password = "Hello" + std::to_string(3);
// password = "Hello3"

// Used in S3-Q2 Password_maker:
// return biggest + reversed + std::to_string(bigIndex % 2);`
      }
    ],
    questions: [
      {
        type: "mcq", diff: "easy",
        q: "To loop through a string backwards, what should the loop START at?",
        opts: ["`0`", "`word.length()`", "`word.length() - 1`", "`word.size() - 1`"],
        ans: 2,
        explain: "The last character is at index `length-1`. For a 4-char string: indexes `0`, `1`, `2`, `3`. Last = `3` (which is `4-1`)."
      },
      {
        type: "code", diff: "easy",
        q: "Write `ReverseWord`.\nTakes `string word`.\nReturns the string reversed.\nTest: `\"Pear\"` → `\"reaP\"`",
        hint: `string ReverseWord(string word)
{
    string reversed = "";
    
    for(int i = word.length() - 1; i >= 0; i--)
    {
        reversed = reversed + word[i];
    }
    
    return reversed;
}`,
        ans: `string ReverseWord(string word)
{
    string reversed = "";
    
    for(int i = word.length() - 1; i >= 0; i--)
    {
        reversed = reversed + word[i];
    }
    
    return reversed;
}`,
        checks: ["ReverseWord", "string reversed", "word.length() - 1", "i >= 0", "i--", "reversed + word[i]", "return reversed"]
      },
      {
        type: "code", diff: "medium",
        q: "Write `FindBiggest`.\nTakes `vector<string> words`.\nReturns the longest word.\nIf two words are same length, return the LATEST one.\nTest: `{\"Lime\",\"Pineapple\",\"Banana\",\"Pear\"}` → `\"Pineapple\"`",
        hint: `string FindBiggest(vector<string> words)
{
    string biggest = "";
    
    for(int i = 0; i < words.size(); i++)
    {
        if(words[i].length() >= biggest.length())
        {
            biggest = words[i];
        }
    }
    
    return biggest;
}`,
        ans: `string FindBiggest(vector<string> words)
{
    string biggest = "";
    
    for(int i = 0; i < words.size(); i++)
    {
        if(words[i].length() >= biggest.length())
        {
            biggest = words[i];
        }
    }
    
    return biggest;
}`,
        checks: ["FindBiggest", "biggest", "words[i].length() >=", "biggest = words[i]", "return biggest"]
      },
      {
        type: "code", diff: "hard",
        q: "EXAM STYLE — S3-Q2:\nWrite `Password_maker`.\nTakes `vector<string> keywords`.\n\nPart 1: biggest word (latest if tied) + track its index.\nPart 2: smallest word (latest if tied).\nPart 3: reverse the smallest word.\nReturn: `biggest + reversed + std::to_string(bigIndex % 2)`.",
        hint: `string Password_maker(vector<string> keywords)
{
    // 1. Find biggest and bigIndex
    
    // 2. Find smallest (start with keywords[0])
    
    // 3. Reverse the smallest string
    
    // 4. Return combined string
}`,
        ans: `string Password_maker(vector<string> keywords)
{
    // Step 1: Find biggest word and index
    string biggest = "";
    int bigIndex = 0;
    
    for(int i = 0; i < keywords.size(); i++)
    {
        if(keywords[i].length() >= biggest.length())
        {
            biggest = keywords[i];
            bigIndex = i;
        }
    }
    
    // Step 2: Find smallest word
    string smallest = keywords[0];
    
    for(int i = 0; i < keywords.size(); i++)
    {
        if(keywords[i].length() <= smallest.length())
        {
            smallest = keywords[i];
        }
    }
    
    // Step 3: Reverse the smallest word
    string reversed = "";
    for(int i = smallest.length() - 1; i >= 0; i--)
    {
        reversed = reversed + smallest[i];
    }
    
    // Step 4: Combine and return
    return biggest + reversed + std::to_string(bigIndex % 2);
}`,
        checks: ["Password_maker", "biggest", "bigIndex", "smallest = keywords[0]", "reversed", "std::to_string", "bigIndex % 2", "return biggest"]
      }
    ]
  },
  {
    title: "Day 4 — Classes, Constructors, Getters & Setters",
    lessons: [
      {
        h: "What is a class?",
        p: "A class is a blueprint for creating objects. It groups related data (attributes) and functions (methods) together. Always end a class definition with a semicolon.",
        code: `class Ship
{
public:
    bool          isStationed;
    string        owner;
    static int    numberShips;
};

// 'public:' means these are accessible from outside
// 'static' means ONE shared count for ALL Ship objects
// Don't forget the ; at the very end`,
        warn: "The semicolon after the closing brace `};` is required for a class. Forget it and your code will not compile."
      },
      {
        h: "Constructor — sets up the object",
        p: "A constructor runs automatically when you create a new object. It has the same name as the class and has NO return type at all (not even void).",
        code: `class Ship
{
public:
    bool isStationed;
    string owner;
    static int numberShips;

    Ship(bool stationed, string ownerName)
    {
        isStationed = stationed;
        owner       = ownerName;
        numberShips++;    // increment the static counter
    }
};

// No 'int', no 'void', no return type whatsoever
// Name EXACTLY matches the class name
// Assigns each parameter to its attribute`
      },
      {
        h: "Getter — reads an attribute",
        p: "A Getter method reads one attribute and returns it. It takes no parameters.",
        code: `string GetOwner()
{
    return owner;
}

// return type matches the attribute type
// no parameters
// just returns the attribute`
      },
      {
        h: "Setter — changes an attribute",
        p: "A Setter method changes one attribute. It takes the new value as a parameter and returns nothing (void).",
        code: `void SetOwner(string newOwner)
{
    owner = newOwner;
}

// return type is always void (returns nothing)
// takes one parameter (the new value)
// assigns it to the attribute`
      },
      {
        h: "Static variable definition",
        p: "A static variable must be declared INSIDE the class and then defined OUTSIDE it. The exam often already provides this line — but you need to know it exists.",
        code: `// Inside the class:
static int numberShips;

// OUTSIDE the class (after the closing }; ):
int Ship::numberShips = 0;

// This line may already exist in the exam file.
// If not, write it yourself after the class.`
      }
    ],
    questions: [
      {
        type: "mcq", diff: "easy",
        q: "What return type does a Constructor have?",
        opts: ["`void`", "`int`", "The class name", "No return type at all"],
        ans: 3,
        explain: "Constructors have NO return type at all. Not even `void`. This is unique to constructors only."
      },
      {
        type: "code", diff: "easy",
        q: "Write a Getter called `GetOwner` that returns the `string` attribute `owner`.",
        hint: `string GetOwner()
{
    return owner;
}`,
        ans: `string GetOwner()
{
    return owner;
}`,
        checks: ["GetOwner", "string", "return owner"]
      },
      {
        type: "code", diff: "easy",
        q: "Write a Setter called `SetOwner` that takes a `string newOwner` and assigns it to the `owner` attribute.",
        hint: `void SetOwner(string newOwner)
{
    owner = newOwner;
}`,
        ans: `void SetOwner(string newOwner)
{
    owner = newOwner;
}`,
        checks: ["SetOwner", "void", "string newOwner", "owner = newOwner"]
      },
      {
        type: "code", diff: "hard",
        q: "EXAM STYLE — S2-Q1:\nWrite the COMPLETE `Ship` class with:\n• `bool isStationed`\n• `string owner`\n• `static int numberShips`\n• `Constructor(bool, string)` — sets attributes, increments numberShips\n• `GetOwner()` — returns owner\n• `SetOwner(string)` — changes owner\nAlso write the static definition line after the class.",
        hint: `class Ship
{
public:
    bool isStationed;
    string owner;
    static int numberShips;
    
    // Write Constructor
    
    // Write Getter
    
    // Write Setter
};

// Write static definition here`,
        ans: `class Ship
{
public:
    bool isStationed;
    string owner;
    static int numberShips;

    Ship(bool stationed, string ownerName)
    {
        isStationed = stationed;
        owner = ownerName;
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

int Ship::numberShips = 0;`,
        checks: ["class Ship", "bool isStationed", "string owner", "static int numberShips", "Ship(", "numberShips++", "GetOwner", "return owner", "SetOwner", "owner = newOwner", "Ship::numberShips = 0"]
      }
    ]
  },
  {
    title: "Day 5 — Inheritance",
    lessons: [
      {
        h: "What is inheritance?",
        p: "A child class automatically gets everything from a parent class. You only write the NEW things. You do not rewrite what the parent already has.",
        code: `class EvilAccount : public BankAccount
{
public:
    int evilLevel = 0;   // new attribute, not in parent
};

// EvilAccount : public BankAccount
// ↑ child              ↑ parent
// balance and name come from BankAccount already
// you don't redeclare them here`,
        tip: "You only write the new things. The parent's attributes and methods exist automatically."
      },
      {
        h: "Calling the parent constructor",
        p: "Your child constructor must call the parent constructor using a colon after the parameter list. This is mandatory — without it your code will not compile.",
        code: `EvilAccount(float balance, string name) : BankAccount(balance, name)
{
    // parent sets balance and name for us
    // the body can be completely empty
}

// Pattern: Child(params) : Parent(params) { }
// Pass the values in the correct order`,
        warn: "Always call the parent constructor with `: ParentName(params)`. Without this your code will not compile."
      },
      {
        h: "Full EvilAccount — S3-Q1 answer",
        p: "This is almost exactly the answer to S3-Q1. Memorise this structure.",
        code: `class EvilAccount : public BankAccount
{
public:
    int evilLevel = 0;

    EvilAccount(float balance, string name) : BankAccount(balance, name)
    {
        // Body left empty, parent handles balance & name
    }

    void SetEvilLevel(int level)
    {
        evilLevel = level;
    }

    int GetEvilLevel()
    {
        return evilLevel;
    }
};`
      }
    ],
    questions: [
      {
        type: "mcq", diff: "easy",
        q: "In a child constructor, how do you call the parent constructor?",
        opts: ["`super(balance, name);`", "`BankAccount::init(balance, name);`", "Using `: BankAccount(balance, name)` after the signature", "You don't need to"],
        ans: 2,
        explain: "Use the colon initialiser: `EvilAccount(float b, string n) : BankAccount(b, n) { }`"
      },
      {
        type: "code", diff: "easy",
        q: "Write a child class called `ElectricVehicle` that inherits `Vehicle`.\nAdd: `int batteryLevel = 100`\nConstructor(`string m`, `int y`) that calls `Vehicle(m, y)`.\n`GetBattery()` returns `batteryLevel`.\n`SetBattery(int)` sets `batteryLevel`.",
        hint: `class ElectricVehicle : public Vehicle
{
public:
    int batteryLevel = 100;
    
    ElectricVehicle(string m, int y) : Vehicle(m, y)
    {
    }
    
    // Add GetBattery and SetBattery
};`,
        ans: `class ElectricVehicle : public Vehicle
{
public:
    int batteryLevel = 100;

    ElectricVehicle(string m, int y) : Vehicle(m, y)
    {
    }

    int GetBattery()
    {
        return batteryLevel;
    }

    void SetBattery(int level)
    {
        batteryLevel = level;
    }
};`,
        checks: ["ElectricVehicle", ": public Vehicle", "int batteryLevel", "ElectricVehicle(", "Vehicle(", "GetBattery", "return batteryLevel", "SetBattery", "batteryLevel = level"]
      },
      {
        type: "code", diff: "hard",
        q: "EXAM STYLE — S3-Q1:\nWrite the COMPLETE `EvilAccount` class.\nInherits from `BankAccount(float balance, string name)`.\n• `int evilLevel = 0`\n• `Constructor(float, string)` — calls BankAccount\n• `SetEvilLevel(int)` — sets evilLevel\n• `GetEvilLevel()` — returns evilLevel",
        hint: `class EvilAccount : public BankAccount
{
public:
    int evilLevel = 0;
    
    EvilAccount(float balance, string name) : BankAccount(balance, name)
    {
    }
    
    // Write Setter and Getter
};`,
        ans: `class EvilAccount : public BankAccount
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
};`,
        checks: ["EvilAccount", ": public BankAccount", "int evilLevel = 0", "EvilAccount(", "BankAccount(", "SetEvilLevel", "evilLevel = level", "GetEvilLevel", "return evilLevel"]
      }
    ]
  },
  {
    title: "Day 6 — Real Exam Mock (From the 23rd)",
    lessons: [
      {
        h: "New Patterns spotted in the Real Exam",
        p: "These questions are pulled directly from your real exam. Notice how they combine maths, boolean logic, arrays, and classes in slightly different ways.",
        code: `// C++ Arrays (used in S1-Q2 instead of vectors)\nbool SafeToFly(int arr[3])\n{\n    // Access using arr[0], arr[1], arr[2]\n}\n\n// AND operator for multiple conditions\nif(arr[1] > 5 && arr[2] <= 50)\n{\n    // both must be true\n}`,
        tip: "The real exam occasionally uses C++ arrays `int arr[3]` instead of `vector<int>`. You access them exactly the same way: `arr[0]`, `arr[1]`, etc."
      }
    ],
    questions: [
      {
        type: "code", diff: "hard",
        q: "REAL EXAM S1-Q1:\nWrite the `Convert` function.\nTakes one argument: `float temp`.\nReturn an `int` of the converted temperature.\n\nRules to calculate new temp:\nMultiply temp by `3.14f`, then add `5`.\n\nExample:\nInput: `15.0f` → `15.0f * 3.14f + 5` = `52`",
        hint: `int Convert(float temp)\n{\n    return (temp * 3.14f) + 5;\n}`,
        ans: `int Convert(float temp)\n{\n    return (temp * 3.14f) + 5;\n}`,
        checks: ["Convert", "float", "return", "* 3.14f", "+ 5"]
      },
      {
        type: "code", diff: "hard",
        q: "REAL EXAM S1-Q2:\nWrite the `SafeToFly` function.\nTakes one argument: a C++ array of 3 integers: `int arr[]` or `int arr[3]`.\nReturn a `bool`.\n\nRules:\n- If index 0 is below `10`, return `false`.\n- If index 1 is above `5` AND index 2 is less than or equal to `50`, return `false`.\n- If it has not triggered the two if conditions, return `true`.",
        hint: `bool SafeToFly(int arr[])\n{\n    if(arr[0] < 10)\n    {\n        return false;\n    }\n    if(arr[1] > 5 && arr[2] <= 50)\n    {\n        return false;\n    }\n    return true;\n}`,
        ans: `bool SafeToFly(int arr[])\n{\n    if(arr[0] < 10)\n    {\n        return false;\n    }\n    if(arr[1] > 5 && arr[2] <= 50)\n    {\n        return false;\n    }\n    return true;\n}`,
        checks: ["SafeToFly", "arr[0] < 10", "return false", "arr[1] > 5", "&&", "arr[2] <= 50", "return true"]
      },
      {
        type: "code", diff: "hard",
        q: "REAL EXAM S2-Q1:\nWrite the `Channel` class.\nAttributes:\n- `string title`\n- `float channelNum`\n\nMethods:\n- Constructor(string, float): assigns to attributes.\n- `SetTitle(string)`: changes title.\n- `GetTitle()`: returns title.\n- `Direction(float current)`: returns a `string`. If current < channelNum, return `\"go up!\"`. If current > channelNum, return `\"go down!\"`. If they are the same, return `\"stay!\"`.",
        hint: `class Channel\n{\npublic:\n    string title;\n    float channelNum;\n    \n    Channel(string t, float c) {\n        // assign\n    }\n    \n    // Getters and setters\n    \n    string Direction(float current) {\n        // if / else if / else\n    }\n};`,
        ans: `class Channel\n{\npublic:\n    string title;\n    float channelNum;\n\n    Channel(string t, float c)\n    {\n        title = t;\n        channelNum = c;\n    }\n\n    void SetTitle(string t)\n    {\n        title = t;\n    }\n\n    string GetTitle()\n    {\n        return title;\n    }\n\n    string Direction(float current)\n    {\n        if(current < channelNum)\n        {\n            return "go up!";\n        }\n        else if(current > channelNum)\n        {\n            return "go down!";\n        }\n        else\n        {\n            return "stay!";\n        }\n    }\n};`,
        checks: ["class Channel", "string title", "float channelNum", "Channel(", "SetTitle", "GetTitle", "Direction", "go up!", "go down!", "stay!"]
      }
    ]
  }
];

const PASS_MODE = {
  heroTitle: "You only need the repeated patterns",
  heroText: "For a 40% pass, do not study C++ broadly. Lock in the small set of function, loop, class, and inheritance templates that your resit keeps reusing.",
  targetChips: [
    "Pass target: 40/100",
    "Best route: S1 + simple classes",
    "Always return, never cout",
    "C++14 only, no auto"
  ],
  winCards: [
    {
      title: "Fastest route to 40%",
      meta: "Highest yield first",
      body: "Get comfortable with arithmetic functions, if/else returns, vector or array indexing, and a basic class with constructor/getter/setter. That is enough to reach the easiest marks quickly.",
      bullets: [
        "Arithmetic return functions like Convert and Update_Points",
        "Array or vector condition logic like SafeToFly and Total_Sand_Diff",
        "Object comparison like BestPressure",
        "Simple class construction like Ship or Channel"
      ]
    },
    {
      title: "Do not chase everything",
      meta: "Avoid scope drift",
      body: "Inheritance and longer string-building questions matter, but they should come after the basics are automatic. The resit is about pattern recall under pressure.",
      bullets: [
        "First pass: functions, branching, loops, arrays, vectors",
        "Second pass: classes, static members, getters and setters",
        "Third pass: inheritance and password-building"
      ]
    },
    {
      title: "Exam habits that save marks",
      meta: "Compile plus logic",
      body: "A large chunk of lost marks comes from small mechanical mistakes, not hard logic. Build a 10-second checklist and run it before every submit.",
      bullets: [
        "Check the return type matches the question",
        "Use the exact argument types they ask for",
        "Return values instead of printing them",
        "Balance every brace and semicolon"
      ]
    }
  ],
  schedule: [
    {
      title: "Block 1: must-know patterns",
      body: "Memorise the core function shapes.",
      bullets: [
        "Arithmetic function returning int or bool",
        "if / else and else if",
        "for loop with i < values.size()",
        "arr[0], arr[1], arr[2] and i % 2"
      ]
    },
    {
      title: "Block 2: class questions",
      body: "Get one class template into muscle memory.",
      bullets: [
        "public attributes",
        "constructor assigning arguments to attributes",
        "getter returning one attribute",
        "setter changing one attribute",
        "static int plus the outside definition"
      ]
    },
    {
      title: "Block 3: stretch topics",
      body: "Only after the basics are stable.",
      bullets: [
        "child class with : Parent(args)",
        "reverse string loops",
        "find biggest or smallest using .length()",
        "std::to_string(int)"
      ]
    }
  ],
  templates: [
    {
      title: "Arithmetic + return",
      use: "Use for Convert, Update_Points, and one-line math questions.",
      code: `int Convert(float temp)\n{\n    return (temp * 3.14f) + 5;\n}`
    },
    {
      title: "If / else function",
      use: "Use whenever the prompt says if this then return that, otherwise return something else.",
      code: `int Update_Points(int points)\n{\n    if(points > 0)\n    {\n        return (points * 4) + 10;\n    }\n    else\n    {\n        return 0;\n    }\n}`
    },
    {
      title: "Loop over vector or array",
      use: "Use for Total_Sand_Diff, counting, and running totals.",
      code: `int Total_Sand_Diff(vector<int> amounts)\n{\n    int even = 0;\n    int odd = 0;\n\n    for(int i = 0; i < amounts.size(); i++)\n    {\n        if(i % 2 == 0)\n        {\n            even = even + amounts[i];\n        }\n        else\n        {\n            odd = odd + amounts[i];\n        }\n    }\n\n    return even - odd;\n}`
    },
    {
      title: "Compare two objects",
      use: "Use for BestPressure-style questions using object attributes.",
      code: `string BestPressure(Wheel& a, Wheel& b)\n{\n    if(a.pressure > b.pressure)\n    {\n        return a.name;\n    }\n    else if(b.pressure > a.pressure)\n    {\n        return b.name;\n    }\n    else\n    {\n        return "both";\n    }\n}`
    },
    {
      title: "Basic class template",
      use: "Use for Ship, Channel, and similar class-building tasks.",
      code: `class Ship\n{\npublic:\n    bool isStationed;\n    string owner;\n    static int numberShips;\n\n    Ship(bool stationed, string newOwner)\n    {\n        isStationed = stationed;\n        owner = newOwner;\n        numberShips++;\n    }\n\n    string GetOwner()\n    {\n        return owner;\n    }\n\n    void SetOwner(string newOwner)\n    {\n        owner = newOwner;\n    }\n};\n\nint Ship::numberShips = 0;`
    },
    {
      title: "Child class template",
      use: "Use for EvilAccount and any inheritance question.",
      code: `class EvilAccount : public BankAccount\n{\npublic:\n    int evilLevel = 0;\n\n    EvilAccount(float balance, string name) : BankAccount(balance, name)\n    {\n    }\n\n    void SetEvilLevel(int level)\n    {\n        evilLevel = level;\n    }\n\n    int GetEvilLevel()\n    {\n        return evilLevel;\n    }\n};`
    }
  ],
  checklist: [
    "Did I return the value instead of printing it?",
    "Does the return type match exactly: int, bool, string, or void?",
    "Did I keep the exact parameter names and types from the question?",
    "If I used a loop, did I write i < values.size() correctly?",
    "If it is an array, did I access arr[0], arr[1], arr[2] directly?",
    "If it is a class, are the required attributes and methods public?",
    "If it is static, did I add the outside definition too?",
    "If it is inheritance, did I call the parent constructor in the initializer list?",
    "Are all semicolons and braces present?",
    "Did I avoid auto and extra libraries?"
  ]
};

const DAY_CHECKPOINTS = [
  {
    timeMinutes: 30,
    questions: [
      {
        type: "mcq", diff: "easy",
        q: "Day 1 Checkpoint: Which keyword means a function returns no value?",
        opts: ["`int`", "`void`", "`return`", "`null`"],
        ans: 1,
        explain: "`void` is the return type used when the function does not return a value."
      },
      {
        type: "code", diff: "easy",
        q: "Write `SubtractTwo`. It takes one `int x` and returns `x - 2`.",
        hint: `int SubtractTwo(int x)\n{\n    return x - 2;\n}`,
        ans: `int SubtractTwo(int x)\n{\n    return x - 2;\n}`,
        checks: ["SubtractTwo", "int", "return", "x - 2", "x-2"]
      },
      {
        type: "code", diff: "medium",
        q: "Write `IsAdult`. It takes `int age` and returns `bool`. Return `true` if age is 18 or more, otherwise `false`.",
        hint: `bool IsAdult(int age)\n{\n    if(age >= 18)\n    {\n        return true;\n    }\n    else\n    {\n        return false;\n    }\n}`,
        ans: `bool IsAdult(int age)\n{\n    if(age >= 18)\n    {\n        return true;\n    }\n    else\n    {\n        return false;\n    }\n}`,
        checks: ["IsAdult", "bool", "age >= 18", "return true", "return false"]
      },
      {
        type: "code", diff: "hard",
        q: "Write `BonusScore`. It takes `int score`. If score is positive, return `(score * 2) + 3`. Otherwise return `1`.",
        hint: `int BonusScore(int score)\n{\n    if(score > 0)\n    {\n        return (score * 2) + 3;\n    }\n    else\n    {\n        return 1;\n    }\n}`,
        ans: `int BonusScore(int score)\n{\n    if(score > 0)\n    {\n        return (score * 2) + 3;\n    }\n    else\n    {\n        return 1;\n    }\n}`,
        checks: ["BonusScore", "score > 0", "* 2", "+ 3", "return 1"]
      }
    ]
  },
  {
    timeMinutes: 30,
    questions: [
      {
        type: "mcq", diff: "easy",
        q: "Day 2 Checkpoint: A vector has 5 items. What is the last valid index?",
        opts: ["`5`", "`4`", "`0`", "`size()`"],
        ans: 1,
        explain: "Indexes start at 0, so 5 items use indexes 0 to 4."
      },
      {
        type: "code", diff: "easy",
        q: "Write `CountItems`. It takes `vector<int> nums` and returns how many items are in the vector.",
        hint: `int CountItems(vector<int> nums)\n{\n    return nums.size();\n}`,
        ans: `int CountItems(vector<int> nums)\n{\n    return nums.size();\n}`,
        checks: ["CountItems", "return", "nums.size()"]
      },
      {
        type: "code", diff: "medium",
        q: "Write `SumOddIndexes`. It takes `vector<int> nums` and returns the sum of the values at odd indexes only.",
        hint: `int SumOddIndexes(vector<int> nums)\n{\n    int total = 0;\n    for(int i = 0; i < nums.size(); i++)\n    {\n        if(i % 2 != 0)\n        {\n            total = total + nums[i];\n        }\n    }\n    return total;\n}`,
        ans: `int SumOddIndexes(vector<int> nums)\n{\n    int total = 0;\n    for(int i = 0; i < nums.size(); i++)\n    {\n        if(i % 2 != 0)\n        {\n            total = total + nums[i];\n        }\n    }\n    return total;\n}`,
        checks: ["SumOddIndexes", "int total", "nums.size()", "i % 2 != 0", "total + nums[i]", "return total"]
      },
      {
        type: "code", diff: "hard",
        q: "Write `BiggerTotal`. It takes `vector<int> nums`. Return the sum of values greater than 10.",
        hint: `int BiggerTotal(vector<int> nums)\n{\n    int total = 0;\n    for(int i = 0; i < nums.size(); i++)\n    {\n        if(nums[i] > 10)\n        {\n            total = total + nums[i];\n        }\n    }\n    return total;\n}`,
        ans: `int BiggerTotal(vector<int> nums)\n{\n    int total = 0;\n    for(int i = 0; i < nums.size(); i++)\n    {\n        if(nums[i] > 10)\n        {\n            total = total + nums[i];\n        }\n    }\n    return total;\n}`,
        checks: ["BiggerTotal", "int total", "nums.size()", "nums[i] > 10", "total + nums[i]", "return total"]
      }
    ]
  },
  {
    timeMinutes: 30,
    questions: [
      {
        type: "mcq", diff: "easy",
        q: "Day 3 Checkpoint: Which call gives the number of characters in a string `word`?",
        opts: ["`word.size`", "`length(word)`", "`word.length()`", "`word.count()`"],
        ans: 2,
        explain: "Use `word.length()` to get the number of characters in a string."
      },
      {
        type: "code", diff: "easy",
        q: "Write `FirstLetter`. It takes `string word` and returns the first character as a `string`.",
        hint: `string FirstLetter(string word)\n{\n    return string(1, word[0]);\n}`,
        ans: `string FirstLetter(string word)\n{\n    return string(1, word[0]);\n}`,
        checks: ["FirstLetter", "string", "return", "word[0]"]
      },
      {
        type: "code", diff: "medium",
        q: "Write `ReverseName`. It takes `string name` and returns the reversed string.",
        hint: `string ReverseName(string name)\n{\n    string reversed = \"\";\n    for(int i = name.length() - 1; i >= 0; i--)\n    {\n        reversed = reversed + name[i];\n    }\n    return reversed;\n}`,
        ans: `string ReverseName(string name)\n{\n    string reversed = \"\";\n    for(int i = name.length() - 1; i >= 0; i--)\n    {\n        reversed = reversed + name[i];\n    }\n    return reversed;\n}`,
        checks: ["ReverseName", "string reversed", "name.length() - 1", "i >= 0", "i--", "reversed + name[i]", "return reversed"]
      },
      {
        type: "code", diff: "hard",
        q: "Write `ShortestWord`. It takes `vector<string> words` and returns the shortest word. If tied, return the latest shortest word.",
        hint: `string ShortestWord(vector<string> words)\n{\n    string smallest = words[0];\n    for(int i = 0; i < words.size(); i++)\n    {\n        if(words[i].length() <= smallest.length())\n        {\n            smallest = words[i];\n        }\n    }\n    return smallest;\n}`,
        ans: `string ShortestWord(vector<string> words)\n{\n    string smallest = words[0];\n    for(int i = 0; i < words.size(); i++)\n    {\n        if(words[i].length() <= smallest.length())\n        {\n            smallest = words[i];\n        }\n    }\n    return smallest;\n}`,
        checks: ["ShortestWord", "smallest = words[0]", "words.size()", "words[i].length() <= smallest.length()", "smallest = words[i]", "return smallest"]
      }
    ]
  },
  {
    timeMinutes: 30,
    questions: [
      {
        type: "mcq", diff: "easy",
        q: "Day 4 Checkpoint: What return type does a setter method usually use?",
        opts: ["`string`", "`int`", "`void`", "`bool`"],
        ans: 2,
        explain: "Setters change an attribute and usually return nothing, so they use `void`."
      },
      {
        type: "code", diff: "easy",
        q: "Write the getter `GetModel` for a class that has `string model;`.",
        hint: `string GetModel()\n{\n    return model;\n}`,
        ans: `string GetModel()\n{\n    return model;\n}`,
        checks: ["GetModel", "string", "return model"]
      },
      {
        type: "code", diff: "medium",
        q: "Write the setter `SetModel`. It takes `string newModel` and stores it in `model`.",
        hint: `void SetModel(string newModel)\n{\n    model = newModel;\n}`,
        ans: `void SetModel(string newModel)\n{\n    model = newModel;\n}`,
        checks: ["SetModel", "void", "string newModel", "model = newModel"]
      },
      {
        type: "code", diff: "hard",
        q: "Write a class called `Book`. Public attributes: `string title`, `int pages`, `static int numberBooks`. Constructor(string, int) sets attributes and increments `numberBooks`. Add `GetTitle()` and `SetTitle(string)`.",
        hint: `class Book\n{\npublic:\n    string title;\n    int pages;\n    static int numberBooks;\n\n    Book(string t, int p)\n    {\n        title = t;\n        pages = p;\n        numberBooks++;\n    }\n\n    string GetTitle()\n    {\n        return title;\n    }\n\n    void SetTitle(string newTitle)\n    {\n        title = newTitle;\n    }\n};\n\nint Book::numberBooks = 0;`,
        ans: `class Book\n{\npublic:\n    string title;\n    int pages;\n    static int numberBooks;\n\n    Book(string t, int p)\n    {\n        title = t;\n        pages = p;\n        numberBooks++;\n    }\n\n    string GetTitle()\n    {\n        return title;\n    }\n\n    void SetTitle(string newTitle)\n    {\n        title = newTitle;\n    }\n};\n\nint Book::numberBooks = 0;`,
        checks: ["class Book", "string title", "int pages", "static int numberBooks", "Book(", "numberBooks++", "GetTitle", "return title", "SetTitle", "title = newTitle", "Book::numberBooks = 0"]
      }
    ]
  },
  {
    timeMinutes: 30,
    questions: [
      {
        type: "mcq", diff: "easy",
        q: "Day 5 Checkpoint: Which line starts a child class that inherits from `Vehicle`?",
        opts: ["`class Car -> Vehicle`", "`class Car : public Vehicle`", "`class Car extends Vehicle`", "`Vehicle class Car`"],
        ans: 1,
        explain: "C++ inheritance uses `class Child : public Parent`."
      },
      {
        type: "code", diff: "easy",
        q: "Write a class `Laptop` that inherits from `Device`. Add a public `int battery = 0;` attribute only.",
        hint: `class Laptop : public Device\n{\npublic:\n    int battery = 0;\n};`,
        ans: `class Laptop : public Device\n{\npublic:\n    int battery = 0;\n};`,
        checks: ["class Laptop", ": public Device", "int battery = 0"]
      },
      {
        type: "code", diff: "medium",
        q: "Write the constructor for `Laptop(float price, string name)` so it calls `Device(price, name)`.",
        hint: `Laptop(float price, string name) : Device(price, name)\n{\n}`,
        ans: `Laptop(float price, string name) : Device(price, name)\n{\n}`,
        checks: ["Laptop(", ": Device(price, name)"]
      },
      {
        type: "code", diff: "hard",
        q: "Write the complete child class `Laptop : public Device` with `int battery = 0`, constructor `(float price, string name)` calling `Device(price, name)`, `SetBattery(int level)`, and `GetBattery()`.",
        hint: `class Laptop : public Device\n{\npublic:\n    int battery = 0;\n\n    Laptop(float price, string name) : Device(price, name)\n    {\n    }\n\n    void SetBattery(int level)\n    {\n        battery = level;\n    }\n\n    int GetBattery()\n    {\n        return battery;\n    }\n};`,
        ans: `class Laptop : public Device\n{\npublic:\n    int battery = 0;\n\n    Laptop(float price, string name) : Device(price, name)\n    {\n    }\n\n    void SetBattery(int level)\n    {\n        battery = level;\n    }\n\n    int GetBattery()\n    {\n        return battery;\n    }\n};`,
        checks: ["class Laptop", ": public Device", "int battery = 0", "Laptop(", ": Device(price, name)", "SetBattery", "battery = level", "GetBattery", "return battery"]
      }
    ]
  }
];

const CHEATSHEET = [
  {title: "Function Template", code: `int FuncName(int x)\n{\n    return x * 4;\n    // ALWAYS return, NEVER cout\n}`},
  {title: "If / Else Template", code: `if(x > 0)\n{\n    return x;\n}\nelse\n{\n    return 0;\n}\n// Operators: >  <  >=  <=  ==  !=`},
  {title: "For Loop Template", code: `for(int i = 0; i < v.size(); i++)\n{\n    // v[i] = current item\n    if(i % 2 == 0)   // even index\n    if(i % 2 != 0)   // odd index\n}`},
  {title: "Running Total", code: `int total = 0;       // BEFORE loop\nfor(int i = 0; i < v.size(); i++)\n{\n    total = total + v[i];\n}\nreturn total;        // AFTER loop`},
  {title: "Reverse a String", code: `string rev = "";\nfor(int i = s.length() - 1; i >= 0; i--)\n{\n    rev = rev + s[i];\n}\nreturn rev;`},
  {title: "Find Biggest String", code: `string biggest = "";\nint bigIndex = 0;\nfor(int i = 0; i < words.size(); i++)\n{\n    if(words[i].length() >= biggest.length())\n    {\n        biggest = words[i];\n        bigIndex = i;\n    }\n}`},
  {title: "Find Smallest String", code: `string smallest = words[0];\nfor(int i = 0; i < words.size(); i++)\n{\n    if(words[i].length() <= smallest.length())\n    {\n        smallest = words[i];\n    }\n}`},
  {title: "Array Conditions", code: `bool SafeToFly(int arr[])\n{\n    if(arr[0] < 10)\n    {\n        return false;\n    }\n    if(arr[1] > 5 && arr[2] <= 50)\n    {\n        return false;\n    }\n    return true;\n}`},
  {title: "Compare Two Objects", code: `string BestPressure(Wheel& a, Wheel& b)\n{\n    if(a.pressure > b.pressure)\n    {\n        return a.name;\n    }\n    else if(b.pressure > a.pressure)\n    {\n        return b.name;\n    }\n    return "both";\n}`},
  {title: "Class Definition", code: `class Ship\n{\npublic:\n    bool isStationed;\n    string owner;\n    static int numberShips;\n\n    Ship(bool stationed, string newOwner)\n    {\n        isStationed = stationed;\n        owner = newOwner;\n        numberShips++;\n    }\n\n    string GetOwner()\n    {\n        return owner;\n    }\n\n    void SetOwner(string newOwner)\n    {\n        owner = newOwner;\n    }\n};\n\nint Ship::numberShips = 0;`},
  {title: "Inheritance Template", code: `class Child : public Parent\n{\npublic:\n    int extra = 0;\n\n    Child(float a, string b) : Parent(a, b)\n    {\n    }\n    \n    int GetExtra()       { return extra; }\n    void SetExtra(int e) { extra = e; }\n};`},
  {title: "Password Builder Pattern", code: `string biggest = words[0];\nint bigIndex = 0;\nstring smallest = words[0];\n\nfor(int i = 0; i < words.size(); i++)\n{\n    if(words[i].length() >= biggest.length())\n    {\n        biggest = words[i];\n        bigIndex = i;\n    }\n    if(words[i].length() <= smallest.length())\n    {\n        smallest = words[i];\n    }\n}\n\nstring reversed = "";\nfor(int i = smallest.length() - 1; i >= 0; i--)\n{\n    reversed = reversed + smallest[i];\n}\n\nreturn biggest + reversed + std::to_string(bigIndex % 2);`}
];

const EXAM_Q = [
  DAYS[0].questions.find(q=>q.diff==='hard'),
  DAYS[1].questions.find(q=>q.diff==='hard'),
  DAYS[2].questions.find(q=>q.diff==='medium'),
  DAYS[3].questions.find(q=>q.type==='code'&&q.diff==='medium'),
  DAYS[3].questions.find(q=>q.diff==='hard'),
  DAYS[4].questions.find(q=>q.diff==='hard'),
];