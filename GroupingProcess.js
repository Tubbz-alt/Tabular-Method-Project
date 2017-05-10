/* now we have Array groupList = [ object group of deg. = 0 , object group of deg. = 1 , .. ]
 * groupList[0] --> object group = {degree: 0, members: Array of implicants}
 * groupList[0].members --> [ object implicant , object implicant , .. ]
 * groupList[0].members[0] --> object implicant = {baseValue: 1, bitsCovered: empty Array, isChecked: false, isDontCare: false, degree: 0}
 * in the end of this file we must have an Array of PrimeImplicants like this :
 * Array PrimeImplicants = [ object implicant , object implicant , .. ]
 * PrimeImplicants[0] = {baseValue: 2, bitsCovered: [1,2,4], isChecked: false, isDontCare: false, degree: 0}
 */

// after each groupingProcess(); we must add the unchecked implicants to this Array
var PrimeImplicants = [];

// this function generate new groupList
// we will need to put all groupLists in Array because we will need to call this function many times 
// untill the new pushed groupList to the Array be empty
function groupingProcess() {
    var newGroupList = [];
    for (var i = 0; i < groupList.length - 1; i++) {
        newGroupList.push(grouping(groupList[i].members, groupList[i + 1].members, i))
    }
    for (var i = 0; i < groupList.length; i++) {
        for (var j = 0; j < groupList[i].members.length; j++) {
            if (!groupList[i].members[j].isChecked) {
                PrimeImplicants.push(groupList[i].members[j]);
            }
        }
    }
    console.log(newGroupList);
    return newGroupList;
}

// this function return new group to br added in the new groupList
function grouping(firstGroup, secondGroup, resultDegree) {
    var resultImplicants = [];
    for (var i = 0; i < firstGroup.length; i++) {
        for (var j = 0; j < secondGroup.length; j++) {
            var hamingDistance = secondGroup[j].baseValue - firstGroup[i].baseValue;
            if (groupingCondition(firstGroup[i], secondGroup[j], hamingDistance)) {
                firstGroup[i].isChecked = true;
                secondGroup[j].isChecked = true;
                var resultBitsCoverd = firstGroup[i].bitsCovered.slice();
                resultBitsCoverd.push(hamingDistance);
                var resultImplicant = new implicant(firstGroup[i].baseValue, resultBitsCoverd, false, false);
                if (!repeatedImpliacnt(resultImplicant, resultImplicants))
                    resultImplicants.push(new implicant(firstGroup[i].baseValue, resultBitsCoverd, false, false));
            }
        }
    }
    return new group(resultDegree, resultImplicants);
}


function groupingCondition(firstImplicant, secondImplicant, hamingDistance) {
    if (arraysEqual(firstImplicant.bitsCovered, secondImplicant.bitsCovered) && power_of_2(hamingDistance))
        return true;
    else
        return false;
}


// helpers functions
function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    a = a.sort((first, second) => first - second);
    b = b.sort((first, second) => first - second);

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

// thanks to StackOverFlow :'D
function power_of_2(n) {
    return n && (n & (n - 1)) === 0;
}

function repeatedImpliacnt(imp, implicants) {
    for (var i = 0; i < implicants.length; i++) {
        if (imp.baseValue === implicants[i].baseValue && arraysEqual(imp.bitsCovered, implicants[i].bitsCovered))
            return true;
    }
    return false;
}