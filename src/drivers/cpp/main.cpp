#include <iostream>
#include <fstream>
#include <string>
#include <unistd.h> // For write()
#include <chrono>   // For measuring execution time

using namespace std;

string solution(const string& input);

int main(int argc, char* argv[]) {
    if (argc < 2) {
        cerr << "Error: Input file name is required." << endl;
        return 1;
    }

    string input_file = argv[1];
    ifstream file(input_file);
    if (!file.is_open()) {
        cerr << "Error: Unable to open file " << input_file << endl;
        return 1;
    }

    string input_content((istreambuf_iterator<char>(file)), istreambuf_iterator<char>());
    file.close();

    auto start = chrono::high_resolution_clock::now();
    string result = solution(input_content);
    auto end = chrono::high_resolution_clock::now();

    auto execution_time = chrono::duration_cast<chrono::milliseconds>(end - start).count();

    string output = "{\"result\":\"" + result + "\",\"time\":\"" + to_string(execution_time) + "ms\"}\n";

    write(3, output.c_str(), output.size());

    return 0;
}