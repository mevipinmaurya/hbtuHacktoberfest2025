class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode curr = head;
        int count = 0;
        while (curr != null) {
            count++;
            curr = curr.next;
        }
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode prevGroupTail = dummy;
        curr = head;
        while (count >= k) {
            ListNode newHead = reverseKNodes(curr, k);
            prevGroupTail.next = newHead;
            prevGroupTail = curr;
            curr = curr.next;
            count -= k;
        }
        return dummy.next;
    }

    private ListNode reverseKNodes(ListNode head, int k) {
        ListNode prev = null, curr = head;
        while (k > 0) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
            k--;
        }
        head.next = curr;
        return prev;
    }
}
